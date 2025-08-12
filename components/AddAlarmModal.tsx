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
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {
    visible: boolean
    onClose: () => void
    onSubmit: (name: string, interval: number) => Promise<void>
}

export default function AddAlarmModal({ visible, onClose, onSubmit }: Props) {
    const [name, setName] = useState('')
    const [interval, setInterval] = useState('')
    const [nameError, setNameError] = useState('')
    const [intervalError, setIntervalError] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (visible) {
            setName('')
            setInterval('')
            setNameError('')
            setIntervalError('')
        }
    }, [visible])

    const onChangeName = (text: string) => {
        setName(text)
        const trimmed = text.trim()
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
        if (!isValid) return
        setSaving(true)
        await onSubmit(name.trim(), parseInt(interval, 10))
        setSaving(false)
        onClose()
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
                    <Text style={styles.title}>알람 등록</Text>
                    <Text style={styles.label}>알람 제목</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={onChangeName}
                        maxLength={50}
                        placeholder="예: 칫솔 교체"
                        autoFocus
                    />
                    {nameError ? (
                        <Text style={styles.error}>{nameError}</Text>
                    ) : null}

                    <Text style={styles.label}>주기 (일)</Text>
                    <TextInput
                        style={styles.input}
                        value={interval}
                        onChangeText={onChangeInterval}
                        keyboardType="number-pad"
                        placeholder="예: 30"
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
                                <Text style={styles.buttonText}>등록</Text>
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
        borderColor: '#E5E5EA',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    error: {
        color: '#FF3B30',
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
        backgroundColor: '#8E8E93',
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    buttonDisabled: {
        backgroundColor: '#A5A5A5',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
})

