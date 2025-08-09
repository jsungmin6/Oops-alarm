import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Pressable,
    Platform,
} from 'react-native'
import DateTimePicker, {
    DateTimePickerAndroid,
} from '@react-native-community/datetimepicker'
import { useState, useEffect } from 'react'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'
import { RootStackParamList } from '../types/navigation'

export default function EditAlarmScreen() {
    const navigation = useNavigation<
        NativeStackNavigationProp<RootStackParamList, 'EditAlarm'>
    >()
    const route = useRoute<RouteProp<RootStackParamList, 'EditAlarm'>>()
    const { id } = route.params

    const [startDate, setStartDate] = useState(new Date())
    const [interval, setInterval] = useState('')
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState('')
    const [intervalError, setIntervalError] = useState('')
    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        const load = async () => {
            const json = await AsyncStorage.getItem('alarms')
            const alarms: Alarm[] = json ? JSON.parse(json) : []
            const target = alarms.find((a) => a.id === id)
            if (target) {
                setName(target.name)
                setStartDate(new Date(target.createdAt))
                setInterval(String(target.interval))
            }
        }
        void load()
    }, [id])

    const openDatePicker = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: startDate,
                mode: 'date',
                onChange: (_, selected) => {
                    if (selected) setStartDate(selected)
                },
            })
        } else {
            setShowPicker(true)
        }
    }

    const handleSave = async () => {
        let hasError = false
        if (!name.trim()) {
            setNameError('알람 이름을 입력해주세요.')
            hasError = true
        } else {
            setNameError('')
        }

        const parsedInterval = parseInt(interval, 10)
        if (!parsedInterval || parsedInterval < 1) {
            setIntervalError('주기는 1 이상의 정수를 입력해야 합니다.')
            hasError = true
        } else {
            setIntervalError('')
        }

        if (hasError) return

        const json = await AsyncStorage.getItem('alarms')
        const alarms: Alarm[] = json ? JSON.parse(json) : []
        const updated = alarms.map((alarm) =>
            alarm.id === id
                ? {
                      ...alarm,
                      name,
                      interval: parsedInterval,
                      createdAt: startDate.toISOString(),
                  }
                : alarm
        )
        await AsyncStorage.setItem('alarms', JSON.stringify(updated))
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>알람 이름</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="예: 칫솔 교체"
            />
            {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
            <Text style={styles.label}>시작일</Text>
            <Pressable style={styles.input} onPress={openDatePicker}>
                <Text>{startDate.toISOString().slice(0, 10)}</Text>
            </Pressable>
            {showPicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(_, selected) => {
                        setShowPicker(false)
                        if (selected) setStartDate(selected)
                    }}
                />
            )}

            <Text style={styles.label}>주기 (일)</Text>
            <TextInput
                style={styles.input}
                value={interval}
                onChangeText={setInterval}
                keyboardType="numeric"
            />
            {intervalError ? (
                <Text style={styles.error}>{intervalError}</Text>
            ) : null}

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
    error: {
        color: 'red',
        marginTop: 4,
    },
})
