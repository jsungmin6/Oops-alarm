import { View, Text, TouchableOpacity } from 'react-native'
import AlarmList from '../components/AlarmList'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import { RootStackParamList } from '../types/navigation'

export default function HomeScreen() {
    const navigation = useNavigation<
        NativeStackNavigationProp<RootStackParamList, 'Home'>
    >()
    const [alarms, setAlarms] = useState<Alarm[]>([])

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


    return (
        <View
            style={{
                flex: 1,
                paddingVertical: 24,
                paddingHorizontal: 12,
                backgroundColor: '#f0fff4',
            }}
        >
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>🕒 내 알람</Text>

            <AlarmList
                alarms={alarms}
                deleteAlarm={deleteAlarm}
                updateAlarmDate={updateAlarmDate}
                onEdit={(id) => navigation.navigate('EditAlarm', { id })}
            />

            <View style={{ marginTop: 24 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateAlarm')}
                    style={{
                        backgroundColor: '#4caf50',
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>➕ 알람 등록</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
