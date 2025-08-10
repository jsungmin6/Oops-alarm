import React, { useState, useEffect } from 'react'
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Alarm } from '../types/Alarm'

interface Props {
    visible: boolean
    alarm: Alarm | null
    onClose: () => void
    onSubmit: (
        id: string,
        name: string,
        interval: number,
        startDate: Date
    ) => Promise<void>
}

export default function EditAlarmModal({
    visible,
    alarm,
    onClose,
    onSubmit,
}: Props) {
    const [name, setName] = useState('')
    const [interval, setInterval] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [tempDate, setTempDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)
    const [nameError, setNameError] = useState('')
    const [intervalError, setIntervalError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (visible && alarm) {
            setName(alarm.name)
            setInterval(String(alarm.interval))
            const d = new Date(alarm.createdAt)
            setStartDate(d)
            setTempDate(d)
            setNameError('')
            setIntervalError('')
        }
    }, [visible, alarm])

    const onChangeName = (text: string) => {
        const limited = text.slice(0, 50)
        setName(limited)
        const trimmed = limited.trim()
        setNameError(trimmed ? '' : '알람 제목을 입력해 주세요.')
    }

    const onChangeInterval = (text: string) => {
        setInterval(text)
        const parsed = parseInt(text, 10)
        setIntervalError(
            text.trim().length === 0 || isNaN(parsed) || parsed < 1
                ? '주기는 1 이상의 숫자여야 합니다.'
                : ''
        )
    }

    const isValid =
        !nameError &&
        !intervalError &&
        name.trim().length > 0 &&
        interval.trim().length > 0

    const handleSubmit = async () => {
        if (!isValid || !alarm) return
        setSaving(true)
        await onSubmit(alarm.id, name.trim(), parseInt(interval, 10), startDate)
        setSaving(false)
        onClose()
    }

    const openPicker = () => {
        setTempDate(startDate)
        setShowPicker(true)
    }

    const onChangeTempDate = (_: any, selected?: Date) => {
        if (selected) setTempDate(selected)
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.overlay}
            >
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>알람 수정</Text>
                    <Text style={styles.label}>알람 제목</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={onChangeName}
                        autoFocus
                        maxLength={50}
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
                                            Platform.OS === 'ios'
                                                ? 'spinner'
                                                : 'calendar'
                                        }
                                        onChange={onChangeTempDate}
                                        style={styles.modalPicker}
                                    />
                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity
                                            style={[styles.pickerButton, styles.pickerCancel]}
                                            onPress={() => setShowPicker(false)}
                                        >
                                            <Text>취소</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.pickerButton, styles.pickerConfirm]}
                                            onPress={() => {
                                                setStartDate(tempDate)
                                                setShowPicker(false)
                                            }}
                                        >
                                            <Text>확인</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    )}

                    <Text style={styles.label}>주기 (일)</Text>
                    <TextInput
                        style={styles.input}
                        value={interval}
                        onChangeText={onChangeInterval}
                        keyboardType="number-pad"
                    />
                    {intervalError ? (
                        <Text style={styles.error}>{intervalError}</Text>
                    ) : null}

                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={saving}
                        >
                            <Text style={styles.buttonText}>취소</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.submitButton,
                                (!isValid || saving) && styles.buttonDisabled,
                            ]}
                            onPress={handleSubmit}
                            disabled={!isValid || saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>저장</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 24,
    },
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    error: {
        color: 'red',
        marginTop: 4,
        fontSize: 12,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#a5d6a7',
    },
    submitButton: {
        backgroundColor: '#4caf50',
    },
    buttonDisabled: {
        backgroundColor: '#c8e6c9',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalPicker: {
        backgroundColor: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 12,
    },
    pickerButton: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        marginHorizontal: 4,
        borderRadius: 4,
    },
    pickerCancel: {
        backgroundColor: '#eee',
    },
    pickerConfirm: {
        backgroundColor: '#ddd',
    },
})

