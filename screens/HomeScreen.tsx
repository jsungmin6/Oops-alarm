// screens/HomeScreen.tsx
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'

export default function HomeScreen() {
    const navigation = useNavigation()
    const [alarms, setAlarms] = useState<Alarm[]>([])

    useFocusEffect(
        useCallback(() => {
            const loadAlarms = async () => {
                const json = await AsyncStorage.getItem('alarms')
                const saved: Alarm[] = json ? JSON.parse(json) : []
                setAlarms(saved)
            }
            loadAlarms()
        }, [])
    )

    // 🔁 알람 갱신 함수
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

    return (
        <View style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>🕒 내 알람</Text>

            {alarms.map((alarm) => (
                <View
                    key={alarm.id}
                    style={{
                        marginVertical: 12,
                        paddingBottom: 8,
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{alarm.name}</Text>
                    <Text>주기: {alarm.interval}일</Text>
                    <Text>시작일: {new Date(alarm.createdAt).toLocaleDateString()}</Text>

                    <View style={{ marginTop: 6 }}>
                        <Button
                            title="🔁 갱신"
                            onPress={() => updateAlarmDate(alarm.id)}
                        />
                    </View>
                </View>
            ))}

            <View style={{ marginTop: 24 }}>
                <Button
                    title="➕ 알람 등록"
                    onPress={() => navigation.navigate('CreateAlarm' as never)}
                />
            </View>
        </View>
    )
}
