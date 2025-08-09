import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import * as Progress from 'react-native-progress'
import { Alarm } from '../types/Alarm'

type Props = {
    alarm: Alarm
    deleteAlarm: (id: string) => void
    updateAlarmDate: (id: string) => void
    onEdit: (id: string) => void
}

const calculateProgress = (createdAt: string, interval: number) => {
    const start = new Date(createdAt)
    const now = new Date()
    const diffDays = Math.floor(
        (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    return {
        progress: Math.min(Math.max(diffDays, 0) / interval, 1),
        remainingDays: Math.max(interval - diffDays, 0),
    }
}

const AlarmRow = ({ alarm, deleteAlarm, updateAlarmDate, onEdit }: Props) => {
    const { progress, remainingDays } = calculateProgress(
        alarm.createdAt,
        alarm.interval
    )

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const translateX = dragX.interpolate({
            inputRange: [-88, 0],
            outputRange: [0, 88],
            extrapolate: 'clamp',
        })
        const opacity = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        })

        return (
            <Animated.View
                style={[
                    styles.deleteAction,
                    { transform: [{ translateX }], opacity },
                ]}
            >
                <TouchableOpacity
                    onPress={() => deleteAlarm(alarm.id)}
                    style={styles.deleteButton}
                >
                    <Text style={styles.deleteText}>삭제</Text>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return (
        <View style={styles.wrapper}>
            <Swipeable
                renderRightActions={renderRightActions}
                overshootRight={false}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{alarm.name}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => onEdit(alarm.id)}>
                                <Text style={styles.actionText}>수정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => updateAlarmDate(alarm.id)}
                            >
                                <Text style={styles.actionText}>갱신</Text>
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
                        <Text style={styles.subText}>
                            남은 일수: {remainingDays}일
                        </Text>
                    </View>
                </View>
            </Swipeable>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    container: {
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
    },
    actionText: {
        fontSize: 16,
        marginLeft: 12,
        color: '#2E7D32',
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
        width: 88,
        height: '100%',
        backgroundColor: '#E6F4EA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteText: {
        color: '#2E7D32',
        fontWeight: '600',
        fontSize: 16,
    },
})

export default AlarmRow

