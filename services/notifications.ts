import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { translate } from '../i18n'
import { Alarm } from '../types/Alarm'
import { getNextReminderDate } from './alarmSchedule'

const ALARM_NOTIFICATION_IDS_STORAGE_KEY = 'alarmNotificationIds'
const ALARM_NOTIFICATIONS_ENABLED_STORAGE_KEY = 'alarmNotificationsEnabled'
const NOTIFICATION_PERMISSION_REQUESTED_STORAGE_KEY = 'notificationPermissionRequested'
const DUE_TODAY_CHANNEL_ID = 'due-today-reminders'
type SyncNotificationOptions = {
  requestPermissions?: boolean
  enabled?: boolean
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

const loadNotificationMap = async () => {
  const json = await AsyncStorage.getItem(ALARM_NOTIFICATION_IDS_STORAGE_KEY)
  return json ? (JSON.parse(json) as Record<string, string>) : {}
}

const saveNotificationMap = async (map: Record<string, string>) => {
  await AsyncStorage.setItem(ALARM_NOTIFICATION_IDS_STORAGE_KEY, JSON.stringify(map))
}

const cancelAllScheduledNotificationsAsync = async () => {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
  await Promise.all(
    scheduledNotifications.map((notification) =>
      cancelNotificationIfNeeded(notification.identifier)
    )
  )
}

export const getAlarmNotificationsEnabledAsync = async () => {
  const value = await AsyncStorage.getItem(ALARM_NOTIFICATIONS_ENABLED_STORAGE_KEY)
  return value == null ? true : value === 'true'
}

export const setAlarmNotificationsEnabledAsync = async (enabled: boolean) => {
  await AsyncStorage.setItem(ALARM_NOTIFICATIONS_ENABLED_STORAGE_KEY, String(enabled))
}

export const hasRequestedNotificationPermissionAsync = async () => {
  const value = await AsyncStorage.getItem(NOTIFICATION_PERMISSION_REQUESTED_STORAGE_KEY)
  return value === 'true'
}

export const markNotificationPermissionRequestedAsync = async () => {
  await AsyncStorage.setItem(NOTIFICATION_PERMISSION_REQUESTED_STORAGE_KEY, 'true')
}

const cancelNotificationIfNeeded = async (notificationId?: string) => {
  if (!notificationId) {
    return
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId)
  } catch {
    // Ignore stale notification ids.
  }
}

const hasNotificationPermission = async () => {
  const settings = await Notifications.getPermissionsAsync()
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  )
}

export const getNotificationPermissionStatusAsync = async () => {
  const settings = await Notifications.getPermissionsAsync()
  return {
    canAskAgain: settings.canAskAgain ?? false,
    granted:
      settings.granted ||
      settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL,
  }
}

export const initializeNotifications = () => {
  void setupNotificationChannelAsync()
}

export const setupNotificationChannelAsync = async () => {
  if (Platform.OS !== 'android') {
    return
  }

  await Notifications.setNotificationChannelAsync(DUE_TODAY_CHANNEL_ID, {
    name: translate('notifications.channelName'),
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#4caf50',
  })
}

export const ensureNotificationPermissionsAsync = async () => {
  await setupNotificationChannelAsync()

  if (await hasNotificationPermission()) {
    return true
  }

  await markNotificationPermissionRequestedAsync()
  const result = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  })

  return (
    result.granted || result.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  )
}

export const scheduleAlarmTestNotificationAsync = async (
  alarmName: string,
  enabled?: boolean
) => {
  const notificationsEnabled =
    enabled ?? (await getAlarmNotificationsEnabledAsync())
  if (!notificationsEnabled) {
    return false
  }

  const permissionGranted = await ensureNotificationPermissionsAsync()
  if (!permissionGranted) {
    return false
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: translate('notifications.testTitle'),
      body: translate('notifications.testBody', { name: alarmName }),
      sound: 'default',
      data: { qaTest: true, alarmName },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
    },
  })

  return true
}

export const syncAlarmNotificationsAsync = async (
  alarms: Alarm[],
  options: SyncNotificationOptions = {}
) => {
  const currentMap = await loadNotificationMap()
  const nextMap: Record<string, string> = {}
  const notificationsEnabled =
    options.enabled ?? (await getAlarmNotificationsEnabledAsync())

  if (!notificationsEnabled) {
    await cancelAllScheduledNotificationsAsync()
    await saveNotificationMap(nextMap)
    return
  }

  if (alarms.length === 0) {
    await cancelAllScheduledNotificationsAsync()
    await saveNotificationMap(nextMap)
    return
  }

  const permissionGranted = options.requestPermissions
    ? await ensureNotificationPermissionsAsync()
    : await hasNotificationPermission()
  if (!permissionGranted) {
    return
  }

  for (const alarm of alarms) {
    await cancelNotificationIfNeeded(currentMap[alarm.id])

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: translate('notifications.dueTodayTitle'),
        body: translate('notifications.dueTodayBody', { name: alarm.name }),
        sound: 'default',
        data: { alarmId: alarm.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: getNextReminderDate(alarm),
        channelId: DUE_TODAY_CHANNEL_ID,
      },
    })

    nextMap[alarm.id] = notificationId
  }

  const removedAlarmIds = Object.keys(currentMap).filter((alarmId) => !(alarmId in nextMap))
  await Promise.all(
    removedAlarmIds.map((alarmId) => cancelNotificationIfNeeded(currentMap[alarmId]))
  )
  await saveNotificationMap(nextMap)
}
