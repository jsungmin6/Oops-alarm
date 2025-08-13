import React, { useState } from 'react'
import {
    Pressable,
    Text,
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    Platform,
    StyleProp,
    ViewStyle,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

interface Props {
    value: Date
    onChange: (date: Date) => void
    style?: StyleProp<ViewStyle>
}

export default function DatePickerField({ value, onChange, style }: Props) {
    const [visible, setVisible] = useState(false)
    const [temp, setTemp] = useState(value)

    const display =
        Platform.OS === 'ios'
            ? (parseInt(String(Platform.Version), 10) >= 14 ? 'inline' : 'spinner')
            : 'calendar'

    const open = () => {
        setTemp(value)
        setVisible(true)
    }

    const handleChange = (_: any, selected?: Date) => {
        if (selected) setTemp(selected)
    }

    const confirm = () => {
        onChange(temp)
        setVisible(false)
    }

    return (
        <>
            <Pressable onPress={open} style={style}>
                <Text>{value.toLocaleDateString()}</Text>
            </Pressable>
            {visible && (
                <Modal transparent animationType="fade">
                    <View style={styles.overlay}>
                        <View style={styles.content}>
                            <DateTimePicker
                                value={temp}
                                mode="date"
                                display={display}
                                onChange={handleChange}
                                style={styles.picker}
                            />
                            <View style={styles.buttons}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancel]}
                                    onPress={() => setVisible(false)}
                                >
                                    <Text>취소</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.confirm]}
                                    onPress={confirm}
                                >
                                    <Text>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    picker: {
        backgroundColor: '#fff',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 12,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        padding: 8,
        marginHorizontal: 4,
        borderRadius: 4,
    },
    cancel: {
        backgroundColor: '#eee',
    },
    confirm: {
        backgroundColor: '#ddd',
    },
})
