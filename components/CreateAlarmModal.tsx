import React, { useEffect, useRef, useState } from 'react'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

 type Props = {
    visible: boolean
    onClose: () => void
    onSubmit: (data: { name: string; interval: number }) => Promise<void> | void
 }

export default function CreateAlarmModal({ visible, onClose, onSubmit }: Props) {
    const [name, setName] = useState('')
    const [interval, setInterval] = useState('')
    const [nameError, setNameError] = useState('')
    const [intervalError, setIntervalError] = useState('')
    const [loading, setLoading] = useState(false)

    const nameRef = useRef<TextInput>(null)

    useEffect(() => {
        if (visible) {
            setName('')
            setInterval('')
            setNameError('')
            setIntervalError('')
            setLoading(false)
            setTimeout(() => nameRef.current?.focus(), 100)
        }
    }, [visible])

    const validate = () => {
        const trimmed = name.trim()
        const num = parseInt(interval, 10)
        let valid = true
        if (!trimmed) {
            setNameError('알람 제목을 입력해 주세요.')
            valid = false
        } else {
            setNameError('')
        }
        if (isNaN(num) || num < 1) {
            setIntervalError('주기는 1 이상의 숫자여야 합니다.')
            valid = false
        } else {
            setIntervalError('')
        }
        return valid
    }

    const handleSubmit = async () => {
        if (loading) return
        if (!validate()) return
        setLoading(true)
        try {
            await onSubmit({ name: name.trim(), interval: parseInt(interval, 10) })
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ width: '100%' }}
                >
                    <SafeAreaView style={styles.container}>
                        <Text style={styles.title}>알람 등록</Text>
                        <TextInput
                            ref={nameRef}
                            style={[styles.input, nameError ? styles.inputError : null]}
                            placeholder="알람 제목"
                            value={name}
                            onChangeText={setName}
                            returnKeyType="next"
                        />
                        {nameError ? (
                            <Text style={styles.error}>{nameError}</Text>
                        ) : null}
                        <TextInput
                            style={[styles.input, intervalError ? styles.inputError : null]}
                            placeholder="주기(일)"
                            value={interval}
                            onChangeText={setInterval}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                        {intervalError ? (
                            <Text style={styles.error}>{intervalError}</Text>
                        ) : null}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onClose}
                                disabled={loading}
                            >
                                <Text style={styles.cancelText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    loading ? styles.buttonDisabled : null,
                                ]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitText}>등록</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        width: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2e7d32',
        alignSelf: 'center',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    cancelText: {
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    submitText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})
