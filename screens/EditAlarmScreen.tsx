import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'

export default function EditAlarmScreen() {
    const navigation = useNavigation()
    const route = useRoute()
    const { id } = route.params as { id: string }

    const [startDate, setStartDate] = useState('')
    const [interval, setInterval] = useState('')
    const [name, setName] = useState('')

    useEffect(() => {
        const load = async () => {
            const json = await AsyncStorage.getItem('alarms')
            const alarms: Alarm[] = json ? JSON.parse(json) : []
            const target = alarms.find((a) => a.id === id)
            if (target) {
                setName(target.name)
                setStartDate(new Date(target.createdAt).toISOString().slice(0, 10))
                setInterval(String(target.interval))
            }
        }
        load()
    }, [id])

    const handleSave = async () => {
        const json = await AsyncStorage.getItem('alarms')
        const alarms: Alarm[] = json ? JSON.parse(json) : []
        const updated = alarms.map((alarm) =>
            alarm.id === id
                ? {
                      ...alarm,
                      interval: parseInt(interval),
                      createdAt: new Date(startDate).toISOString(),
                  }
                : alarm
        )
        await AsyncStorage.setItem('alarms', JSON.stringify(updated))
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>알람 이름</Text>
            <Text style={styles.name}>{name}</Text>

            <Text style={styles.label}>시작일 (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="2024-01-01"
            />

            <Text style={styles.label}>주기 (일)</Text>
            <TextInput
                style={styles.input}
                value={interval}
                onChangeText={setInterval}
                keyboardType="numeric"
            />

            <Button title="저장" onPress={handleSave} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    name: {
        fontSize: 18,
        marginTop: 8,
    },
})
