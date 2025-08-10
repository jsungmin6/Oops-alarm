import React, { useRef } from 'react'
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
    onEdit: (
        alarm: Alarm,
        triggerRef: any,
        swipeableRef: Swipeable | null
    ) => void
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
    const editRef = useRef<any>(null)
    const swipeableRef = useRef<Swipeable | null>(null)

    const isDue = remainingDays === 0
    const progressColor = isDue ? '#FFD700' : '#4caf50'

    const ACTION_WIDTH = 80
    const TOTAL_WIDTH = ACTION_WIDTH * 2

    const renderRightActions = (
        swipeProgress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
    ) => {
        const translateX = dragX.interpolate({
            inputRange: [-TOTAL_WIDTH, 0],
            outputRange: [0, TOTAL_WIDTH],
            extrapolate: 'clamp',
        })

        const actionWidth = swipeProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, ACTION_WIDTH],
            extrapolate: 'clamp',
        })

        return (
            <Animated.View
                style={[
                    styles.actionsContainer,
                    {
                        width: TOTAL_WIDTH,
                        transform: [{ translateX }],
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.action,
                        styles.editAction,
                        {
                            width: actionWidth,
                            left: 0,
                        },
                    ]}
                >
                    <TouchableOpacity
                        ref={editRef}
                        onPress={() =>
                            onEdit(alarm, editRef.current, swipeableRef.current)
                        }
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionLabel}>수정</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View
                    style={[
                        styles.action,
                        styles.deleteAction,
                        {
                            width: actionWidth,
                            left: actionWidth,
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => deleteAlarm(alarm.id)}
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionLabel}>삭제</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        )
    }

    return (
        <View style={[styles.wrapper, isDue && styles.dueWrapper]}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                overshootRight={false}
                friction={3}
                rightThreshold={40}
                useNativeAnimations={false}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{alarm.name}</Text>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={() => updateAlarmDate(alarm.id)}
                                style={styles.refreshButton}
                            >
                                <Text style={styles.refreshButtonText}>갱신</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Progress.Bar
                        progress={progress}
                        width={null}
                        height={14}
                        borderRadius={7}
                        color={progressColor}
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
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#bdbdbd',
    },
    dueWrapper: {
        borderColor: '#757575',
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
        flex: 1,
        marginRight: 8,
        flexWrap: 'wrap',
    },
    actions: {
        flexDirection: 'row',
        flexShrink: 0,
    },
    refreshButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
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
    actionsContainer: {
        height: '100%',
        overflow: 'hidden',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
    action: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editAction: {
        backgroundColor: '#81C784',
    },
    deleteAction: {
        backgroundColor: '#388E3C',
    },
    actionButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
})

export default AlarmRow

