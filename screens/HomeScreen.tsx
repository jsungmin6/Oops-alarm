import { View, Text, Button } from 'react-native'
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
        <View style={{ flex: 1, padding: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>🕒 내 알람</Text>

            {alarms.map((alarm) => {
                const progress = calculateProgress(alarm.createdAt, alarm.interval)

                return (
                    <View
                        key={alarm.id}
                        style={{
                            marginVertical: 16,
                            paddingBottom: 12,
                            borderBottomWidth: 1,
                            borderColor: '#ccc',
                        }}
                    >
                        {/* 상단: 제목 및 버튼들 */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>{alarm.name}</Text>
                            <View
                                style={{ flexDirection: 'row', gap: 8 }}
                            >
                                <Button
                                    title="🔁 갱신"
                                    onPress={() => updateAlarmDate(alarm.id)}
                                />
                                <Button
                                    title="✏️ 수정"
                                    onPress={() =>
                                        navigation.navigate('EditAlarm', {
                                            id: alarm.id,
                                        })
                                    }
                                />
                                <Button
                                    title="🗑 삭제"
                                    color="#d32f2f"
                                    onPress={() => deleteAlarm(alarm.id)}
                                />
                            </View>
                        </View>

                        {/* 프로그레스바 */}
                        <Progress.Bar
                            progress={progress}
                            width={null}
                            height={10}
                            borderRadius={5}
                            color="#4caf50"
                            unfilledColor="#e0e0e0"
                            style={{ marginTop: 8 }}
                        />

                        {/* 하단: 시작일과 남은 일수 */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 8,
                            }}
                        >
                            <Text>
                                시작일:{' '}
                                {new Date(alarm.createdAt).toLocaleDateString()}
                            </Text>
                            <Text>
                                남은 일수:{' '}
                                {Math.max(
                                    0,
                                    alarm.interval -
                                        Math.floor(progress * alarm.interval)
                                )}
                                일
                            </Text>
                        </View>
                    </View>
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
