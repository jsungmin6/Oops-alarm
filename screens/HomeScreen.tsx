import {
    Alert,
    Text,
    TouchableOpacity,
    View,
    Image,
    AppState,
    AppStateStatus,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AlarmList from '../components/AlarmList'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback, useRef, useEffect } from 'react'
import AddAlarmModal from '../components/AddAlarmModal'
import EditAlarmModal from '../components/EditAlarmModal'
import { Swipeable } from 'react-native-gesture-handler'
import BannerAdSection from '../components/BannerAdSection'
import { useLocalization } from '../i18n'
import { loadAlarmsFromStorage, saveAlarmsToStorage } from '../services/alarmStorage'
import {
    getAlarmNotificationsEnabledAsync,
    scheduleAlarmTestNotificationAsync,
    setAlarmNotificationsEnabledAsync,
    syncAlarmNotificationsAsync,
} from '../services/notifications'

export default function HomeScreen() {
    const { t } = useLocalization()
    const [alarms, setAlarms] = useState<Alarm[]>([])
    const [showAdd, setShowAdd] = useState(false)
    const addButtonRef = useRef<any>(null)
    const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null)
    const editButtonRef = useRef<any>(null)
    const editingSwipeRef = useRef<Swipeable | null>(null)
    const [currentTime, setCurrentTime] = useState(Date.now())
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)

    const loadAlarms = useCallback(async () => {
        const [saved, storedNotificationsEnabled] = await Promise.all([
            loadAlarmsFromStorage(),
            getAlarmNotificationsEnabledAsync(),
        ])
        setAlarms(saved)
        setNotificationsEnabled(storedNotificationsEnabled)
        setCurrentTime(Date.now())
    }, [])

    useFocusEffect(
        useCallback(() => {
            void loadAlarms()
        }, [loadAlarms])
    )

    useEffect(() => {
        const handleAppStateChange = (nextState: AppStateStatus) => {
            if (nextState === 'active') {
                void loadAlarms()
            }
        }

        const subscription = AppState.addEventListener('change', handleAppStateChange)

        return () => {
            subscription.remove()
        }
    }, [loadAlarms])

    const updateAlarmDate = async (id: string) => {
        const storedAlarms = await loadAlarmsFromStorage()

        const updated = storedAlarms.map((alarm) =>
            alarm.id === id
                ? { ...alarm, createdAt: new Date().toISOString() }
                : alarm
        )

        await saveAlarmsToStorage(updated)
        await syncAlarmNotificationsAsync(updated, {
            enabled: notificationsEnabled,
        })
        setAlarms(updated)
        setCurrentTime(Date.now())
    }

    const deleteAlarm = async (id: string) => {
        const storedAlarms = await loadAlarmsFromStorage()

        const filtered = storedAlarms.filter((alarm) => alarm.id !== id)

        await saveAlarmsToStorage(filtered)
        await syncAlarmNotificationsAsync(filtered, {
            enabled: notificationsEnabled,
        })
        setAlarms(filtered)
        setCurrentTime(Date.now())
    }

    const createId = () =>
        Date.now().toString(36) + Math.random().toString(36).slice(2, 10)

    const handleAdd = async (name: string, interval: number) => {
        const newAlarm: Alarm = {
            id: createId(),
            name,
            interval,
            createdAt: new Date().toISOString(),
        }
        const current = await loadAlarmsFromStorage()
        current.push(newAlarm)
        await saveAlarmsToStorage(current)
        await syncAlarmNotificationsAsync(current, {
            enabled: notificationsEnabled,
            requestPermissions: notificationsEnabled,
        })
        setAlarms(current)
        setCurrentTime(Date.now())
    }

    const handleEdit = async (
        id: string,
        name: string,
        interval: number,
        startDate: Date
    ) => {
        const storedAlarms = await loadAlarmsFromStorage()
        const updated = storedAlarms.map((alarm) =>
            alarm.id === id
                ? {
                      ...alarm,
                      name,
                      interval,
                      createdAt: startDate.toISOString(),
                  }
                : alarm
        )
        await saveAlarmsToStorage(updated)
        await syncAlarmNotificationsAsync(updated, {
            enabled: notificationsEnabled,
        })
        setAlarms(updated)
        editingSwipeRef.current?.close()
        editingSwipeRef.current = null
        setCurrentTime(Date.now())
    }

    const handleToggleNotifications = async () => {
        const nextValue = !notificationsEnabled

        if (nextValue) {
            await setAlarmNotificationsEnabledAsync(true)
            const scheduled = await scheduleAlarmTestNotificationAsync(
                alarms[0]?.name || 'Oops Alarm',
                true
            )

            if (!scheduled) {
                await setAlarmNotificationsEnabledAsync(false)
                setNotificationsEnabled(false)
                Alert.alert(
                    t('common.confirm'),
                    t('notifications.permissionsDenied')
                )
                return
            }
        } else {
            await setAlarmNotificationsEnabledAsync(false)
        }

        await syncAlarmNotificationsAsync(alarms, {
            enabled: nextValue,
            requestPermissions: nextValue,
        })
        setNotificationsEnabled(nextValue)
    }

    const handleTestNotification = async () => {
        const alarmName = alarms[0]?.name || 'Oops Alarm'

        if (!notificationsEnabled) {
            Alert.alert(t('common.confirm'), t('notifications.alarmsOff'))
            return
        }

        const scheduled = await scheduleAlarmTestNotificationAsync(alarmName, true)
        if (!scheduled) {
            Alert.alert(t('common.confirm'), t('notifications.permissionsDenied'))
            return
        }

        Alert.alert(
            t('notifications.testScheduledTitle'),
            t('notifications.testScheduledBody', { name: alarmName })
        )
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#fff', paddingTop: 24 }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 24,
                }}
            >
                <Text
                    style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'Jua-Regular' }}
                >
                    {t('home.title')}
                </Text>
                <Image
                    source={require('../assets/alarm_smile.png')}
                    style={{ width: 40, height: 40, marginLeft: 8 }}
                />
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: 24,
                    marginTop: 16,
                    marginBottom: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 16,
                    backgroundColor: '#f5fbef',
                    borderWidth: 1,
                    borderColor: '#d5e7bf',
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#36561d',
                            fontFamily: 'Jua-Regular',
                        }}
                    >
                        {t('home.alarmToggleLabel')}
                    </Text>
                    <Text
                        style={{
                            marginTop: 4,
                            fontSize: 12,
                            color: '#6d8f3c',
                            fontFamily: 'Jua-Regular',
                        }}
                    >
                        10초 테스트 알림 가능
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={handleTestNotification}
                        style={{
                            marginRight: 10,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            borderRadius: 12,
                            backgroundColor: '#e4f3d2',
                        }}
                    >
                        <Text
                            style={{
                                color: '#45671d',
                                fontSize: 13,
                                fontFamily: 'Jua-Regular',
                            }}
                        >
                            10초 테스트
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleToggleNotifications}
                        style={{
                            width: 66,
                            padding: 4,
                            borderRadius: 999,
                            backgroundColor: notificationsEnabled ? '#4caf50' : '#c7d7b2',
                        }}
                    >
                        <View
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                backgroundColor: '#fff',
                                alignSelf: notificationsEnabled ? 'flex-end' : 'flex-start',
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <AlarmList
                alarms={alarms}
                deleteAlarm={deleteAlarm}
                updateAlarmDate={updateAlarmDate}
                onEdit={(alarm, ref, swipeRef) => {
                    editButtonRef.current = ref
                    editingSwipeRef.current = swipeRef
                    setEditingAlarm(alarm)
                }}
                currentTime={currentTime}
                header={<BannerAdSection />}
                footer={
                    <TouchableOpacity
                        ref={addButtonRef}
                        onPress={() => setShowAdd(true)}
                        style={{
                            alignSelf: 'center',
                            marginTop: 16,
                            marginBottom: 32,
                            width: 64,
                            height: 64,
                            borderRadius: 32,
                            backgroundColor: '#4caf50',
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 32,
                                color: 'white',
                                fontWeight: 'bold',
                                fontFamily: 'Jua-Regular',
                            }}
                        >
                            +
                        </Text>
                    </TouchableOpacity>
                }
            />
            <AddAlarmModal
                visible={showAdd}
                onClose={() => {
                    setShowAdd(false)
                    addButtonRef.current?.focus?.()
                }}
                onSubmit={handleAdd}
            />
            <EditAlarmModal
                visible={!!editingAlarm}
                alarm={editingAlarm}
                onClose={() => {
                    setEditingAlarm(null)
                    editingSwipeRef.current?.close()
                    editingSwipeRef.current = null
                    editButtonRef.current?.focus?.()
                }}
                onSubmit={handleEdit}
            />
        </SafeAreaView>
    )
}
