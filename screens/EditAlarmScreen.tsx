import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Pressable,
    Platform,
    Modal,
} from 'react-native'
import { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
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
    const [showPicker, setShowPicker] = useState(false)
    const [tempDate, setTempDate] = useState(new Date())
    const [nameError, setNameError] = useState('')
    const [intervalError, setIntervalError] = useState('')

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

    const handleSave = async () => {
        const trimmedName = name.trim()
        const parsedInterval = parseInt(interval, 10)
        let valid = true

        if (!trimmedName) {
            setNameError('알람 이름을 입력해 주세요.')
            valid = false
        } else {
            setNameError('')
        }

        if (isNaN(parsedInterval) || parsedInterval < 1) {
            setIntervalError('주기는 1 이상의 숫자여야 합니다.')
            valid = false
        } else {
            setIntervalError('')
        }

        if (!valid) return

        const json = await AsyncStorage.getItem('alarms')
        const alarms: Alarm[] = json ? JSON.parse(json) : []
        const updated = alarms.map((alarm) =>
            alarm.id === id
                ? {
                      ...alarm,
                      name: trimmedName,
                      interval: parsedInterval,
                      createdAt: startDate.toISOString(),
                  }
                : alarm
        )
        await AsyncStorage.setItem('alarms', JSON.stringify(updated))
        navigation.goBack()
    }

    const openPicker = () => {
        setTempDate(startDate)
        setShowPicker(true)
    }

    const confirmDate = () => {
        setStartDate(tempDate)
        setShowPicker(false)
    }

    const cancelPicker = () => {
        setShowPicker(false)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>알람 이름</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
            />
            {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

            <Text style={styles.label}>시작일</Text>
            <Pressable onPress={openPicker} style={styles.input}>
                <Text>{startDate.toISOString().slice(0, 10)}</Text>
            </Pressable>
            {showPicker && (
                <Modal transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <DateTimePicker
                                value={tempDate}
                                mode="date"
                                display={
                                    Platform.OS === 'ios' ? 'spinner' : 'calendar'
                                }
                                onChange={(_, date) => {
                                    if (date) setTempDate(date)
                                }}
                                style={styles.modalPicker}
                            />
                            <View style={styles.modalButtons}>
                                <Button title="취소" onPress={cancelPicker} />
                                <View style={styles.buttonSpacer} />
                                <Button title="확인" onPress={confirmDate} />
                            </View>
                        </View>
                    </View>
                </Modal>
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
    modalPicker: {
        backgroundColor: '#fff',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    buttonSpacer: {
        width: 8,
    },
})
