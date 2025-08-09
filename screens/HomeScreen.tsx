import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import AlarmList from '../components/AlarmList'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'
import { RootStackParamList } from '../types/navigation'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
    const navigation = useNavigation<
        NativeStackNavigationProp<RootStackParamList, 'Home'>
    >()
    const [alarms, setAlarms] = useState<Alarm[]>([])
    const insets = useSafeAreaInsets()

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
            style={{ flex: 1, padding: 24, backgroundColor: '#f0fff4' }}
        >
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>🕒 내 알람</Text>

            <AlarmList
                alarms={alarms}
                deleteAlarm={deleteAlarm}
                updateAlarmDate={updateAlarmDate}
                onEdit={(id) => navigation.navigate('EditAlarm', { id })}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate('CreateAlarm')}
                style={[styles.fab, { bottom: insets.bottom + 24 }]}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        alignSelf: 'center',
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    fabText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
})
