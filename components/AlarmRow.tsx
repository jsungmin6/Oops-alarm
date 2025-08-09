import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import * as Progress from 'react-native-progress'
import { Alarm } from '../types/Alarm'

type Props = {
    alarm: Alarm
    onEdit: (id: string) => void
    updateAlarmDate: (id: string) => void
    deleteAlarm: (id: string) => void
}

const AlarmRow = ({ alarm, onEdit, updateAlarmDate, deleteAlarm }: Props) => {
    const progress = calculateProgress(alarm.createdAt, alarm.interval)
    const remainingDays = Math.max(
        0,
        alarm.interval - Math.floor(progress * alarm.interval)
    )

    const renderRightActions = (_progress: any, dragX: Animated.AnimatedInterpolation<number>) => {
        const translateX = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [0, 80],
            extrapolate: 'clamp',
        })
        return (
            <Animated.View style={{ transform: [{ translateX }] }}>
                <TouchableOpacity
                    onPress={() => deleteAlarm(alarm.id)}
                    style={styles.deleteAction}
                >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{alarm.name}</Text>
                    <View style={styles.iconRow}>
                        <TouchableOpacity
                            onPress={() => onEdit(alarm.id)}
                            style={styles.iconButton}
                        >
                            <Text style={styles.icon}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => updateAlarmDate(alarm.id)}
                            style={styles.iconButton}
                        >
                            <Text style={styles.icon}>🔁</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Progress.Bar
                    progress={progress}
                    width={null}
                    height={14}
                    borderRadius={7}
                    color="#4caf50"
                    unfilledColor="#e0f2f1"
                    style={styles.progress}
                />

                <View style={styles.footer}>
                    <Text style={styles.subText}>
                        시작일: {new Date(alarm.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.subText}>남은 일수: {remainingDays}일</Text>
                </View>
            </View>
        </Swipeable>
    )
}

const calculateProgress = (createdAt: string, interval: number): number => {
    const start = new Date(createdAt)
    const now = new Date()
    const diffDays = Math.floor(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    return Math.min(Math.max(diffDays, 0) / interval, 1)
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        padding: 16,
        marginVertical: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconRow: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 12,
    },
    icon: {
        fontSize: 20,
    },
    progress: {
        marginTop: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    subText: {
        fontSize: 12,
        color: '#888',
    },
    deleteAction: {
        width: 80,
        height: '100%',
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        fontSize: 24,
    },
})

export default AlarmRow

