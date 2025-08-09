import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
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
                onEdit={(alarm) =>
                    navigation.navigate('EditAlarm', { id: alarm.id })
                }
                footer={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CreateAlarm')}
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
        </SafeAreaView>
    )
}
