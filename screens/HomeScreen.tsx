import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AlarmList from '../components/AlarmList'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback, useRef } from 'react'
import AddAlarmModal from '../components/AddAlarmModal'
import EditAlarmModal from '../components/EditAlarmModal'

export default function HomeScreen() {
    const [alarms, setAlarms] = useState<Alarm[]>([])
    const [showAdd, setShowAdd] = useState(false)
    const addButtonRef = useRef<any>(null)
    const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null)
    const editButtonRef = useRef<any>(null)

    useFocusEffect(
        useCallback(() => {
            const loadAlarms = async () => {
                const json = await AsyncStorage.getItem('alarms')
                const saved: Alarm[] = json ? JSON.parse(json) : []
                setAlarms(saved)
            }
            void loadAlarms()
        }, [])
    )

    const updateAlarmDate = async (id: string) => {
        const json = await AsyncStorage.getItem('alarms')
        const alarms: Alarm[] = json ? JSON.parse(json) : []

        const updated = alarms.map((alarm) =>
            alarm.id === id
                ? { ...alarm, createdAt: new Date().toISOString() }
                : alarm
        )

        await AsyncStorage.setItem('alarms', JSON.stringify(updated))
        setAlarms(updated)
    }

    const deleteAlarm = async (id: string) => {
        const json = await AsyncStorage.getItem('alarms')
        const alarms: Alarm[] = json ? JSON.parse(json) : []

        const filtered = alarms.filter((alarm) => alarm.id !== id)

        await AsyncStorage.setItem('alarms', JSON.stringify(filtered))
        setAlarms(filtered)
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
        const json = await AsyncStorage.getItem('alarms')
        const current: Alarm[] = json ? JSON.parse(json) : []
        current.push(newAlarm)
        await AsyncStorage.setItem('alarms', JSON.stringify(current))
        setAlarms(current)
    }

    const handleUpdate = async (
        id: string,
        name: string,
        interval: number,
        startDate: Date
    ) => {
        const json = await AsyncStorage.getItem('alarms')
        const alarms: Alarm[] = json ? JSON.parse(json) : []
        const updated = alarms.map((alarm) =>
            alarm.id === id
                ? {
                      ...alarm,
                      name,
                      interval,
                      createdAt: startDate.toISOString(),
                  }
                : alarm
        )
        await AsyncStorage.setItem('alarms', JSON.stringify(updated))
        setAlarms(updated)
    }


    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#f0fff4', paddingTop: 24 }}
        >
            <Text
                style={{ fontSize: 24, fontWeight: 'bold', marginHorizontal: 24 }}
            >
                🕒 내 알람
            </Text>

            <AlarmList
                alarms={alarms}
                deleteAlarm={deleteAlarm}
                updateAlarmDate={updateAlarmDate}
                onEdit={(alarm, ref) => {
                    setEditingAlarm(alarm)
                    editButtonRef.current = ref
                }}
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
                    editButtonRef.current?.current?.focus?.()
                }}
                onSubmit={handleUpdate}
            />
        </SafeAreaView>
    )
}
