// screens/CreateAlarmScreen.tsx
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'
import { v4 as uuidv4 } from 'uuid'  // uuid 패키지 필요

export default function CreateAlarmScreen() {
    const navigation = useNavigation()
    const [name, setName] = useState('')
    const [interval, setInterval] = useState('')

    const handleSubmit = async () => {
        if (!name || !interval) return

        const newAlarm: Alarm = {
            id: uuidv4(),
            name,
            interval: parseInt(interval),
            createdAt: new Date().toISOString(),
        }

        // 기존 알람 목록 불러오기
        const json = await AsyncStorage.getItem('alarms')
        const alarms: Alarm[] = json ? JSON.parse(json) : []

        // 새 알람 추가 후 저장
        alarms.push(newAlarm)
        await AsyncStorage.setItem('alarms', JSON.stringify(alarms))

        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>알람 이름</Text>
            <TextInput
                style={styles.input}
                placeholder="예: 칫솔 교체"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>주기 (일)</Text>
            <TextInput
                style={styles.input}
                placeholder="예: 30"
                value={interval}
                onChangeText={setInterval}
                keyboardType="numeric"
            />

            <Button title="등록하기" onPress={handleSubmit} />
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
})
