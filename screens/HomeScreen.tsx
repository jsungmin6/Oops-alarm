import { View, Text, Button, TouchableOpacity } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import * as Progress from 'react-native-progress'
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

    const calculateProgress = (createdAt: string, interval: number): number => {
        const start = new Date(createdAt)
        const now = new Date()
        const diffDays = Math.floor(
            (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        )
        return Math.min(Math.max(diffDays, 0) / interval, 1)
    }

    const deleteAlarm = async (id: string) => {
        const json = await AsyncStorage.getItem('alarms')
        const alarms: Alarm[] = json ? JSON.parse(json) : []

        const filtered = alarms.filter((alarm) => alarm.id !== id)

        await AsyncStorage.setItem('alarms', JSON.stringify(filtered))
        setAlarms(filtered)
    }


    return (
        <View style={{ flex: 1, padding: 24, backgroundColor: '#e8f5e9' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2e7d32' }}>
                🕒 내 알람
            </Text>

            {alarms.map((alarm) => {
                const progress = calculateProgress(alarm.createdAt, alarm.interval)
                const remainingDays = Math.max(
                    0,
                    alarm.interval - Math.floor(progress * alarm.interval)
                )

                return (
                    <Swipeable
                        key={alarm.id}
                        renderRightActions={() => (
                            <TouchableOpacity
                                onPress={() => deleteAlarm(alarm.id)}
                                style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 64,
                                    backgroundColor: '#a8e6cf',
                                }}
                            >
                                <Text style={{ fontSize: 28 }}>🗑️</Text>
                            </TouchableOpacity>
                        )}
                    >
                    <View
                        style={{
                            marginVertical: 16,
                            padding: 16,
                            backgroundColor: '#ffffff',
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#a8e6cf',
                        }}
                    >
                        {/* 상단: 제목과 버튼 */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{ fontSize: 20, fontWeight: 'bold', color: '#2e7d32' }}
                            >
                                {alarm.name}
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    gap: 12,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => updateAlarmDate(alarm.id)}
                                >
                                    <Text style={{ fontSize: 20 }}>🔁</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('EditAlarm', {
                                            id: alarm.id,
                                        })
                                    }
                                >
                                    <Text style={{ fontSize: 20 }}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deleteAlarm(alarm.id)}
                                >
                                    <Text style={{ fontSize: 20 }}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 프로그레스바 */}
                        <Progress.Bar
                            progress={progress}
                            width={null}
                            height={14}
                            borderRadius={7}
                            color="#4caf50"
                            unfilledColor="#e0f2f1"
                            style={{ marginTop: 12 }}
                        />

                        {/* 하단: 시작일과 남은 일수 */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ fontSize: 12, color: '#888' }}>
                                시작일: {new Date(alarm.createdAt).toLocaleDateString()}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#888' }}>
                                남은 일수: {remainingDays}일
                            </Text>
                        </View>
                    </View>
                    </Swipeable>
                )
            })}

            <View style={{ marginTop: 24 }}>
                <Button
                    title="➕ 알람 등록"
                    onPress={() => navigation.navigate('CreateAlarm')}
                />
            </View>
        </View>
    )
}
