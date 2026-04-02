import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { translate } from '../i18n'
import { Alarm } from '../types/Alarm'
import { getNotificationSlots } from './alarmSchedule'

const REMINDER_HOURS = [8, 18]

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
  const notificationsEnabled =
    options.enabled ?? (await getAlarmNotificationsEnabledAsync())

  if (!notificationsEnabled || alarms.length === 0) {
    await cancelAllScheduledNotificationsAsync()
    return
  }

  const permissionGranted = options.requestPermissions
    ? await ensureNotificationPermissionsAsync()
    : await hasNotificationPermission()
  if (!permissionGranted) {
    return
  }

  await cancelAllScheduledNotificationsAsync()

  const now = new Date()
  const followUpDays = 1
  const slots = getNotificationSlots(alarms, followUpDays, now)
  const sortedDates = Object.keys(slots).sort()

  for (const dateKey of sortedDates) {
    const alarmsForDate = slots[dateKey]
    const [year, month, day] = dateKey.split('-').map(Number)

    for (const hour of REMINDER_HOURS) {
      const triggerDate = new Date(year, month - 1, day, hour, 0, 0)
      if (triggerDate.getTime() <= now.getTime()) continue

      const body =
        alarmsForDate.length === 1
          ? translate('notifications.dueTodayBody', { name: alarmsForDate[0].name })
          : translate('notifications.multipleDueBody', { count: alarmsForDate.length })

      await Notifications.scheduleNotificationAsync({
        content: {
          title: translate('notifications.dueTodayTitle'),
          body,
          sound: 'default',
          data: { alarmIds: alarmsForDate.map((a) => a.id) },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: DUE_TODAY_CHANNEL_ID,
        },
      })
    }
  }
}
