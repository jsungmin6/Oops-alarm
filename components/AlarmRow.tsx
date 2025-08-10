import React, { useRef } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Image,
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

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
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
                <View style={[styles.container, isDue && styles.dueContainer]}>
                    <View style={styles.header}>
                        <Text
                            style={styles.title}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {alarm.name}
                        </Text>
                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={() => updateAlarmDate(alarm.id)}
                                style={styles.refreshButton}
                            >
                                <View style={styles.refreshButtonContent}>
                                    <Text style={styles.refreshButtonText}>갱신</Text>
                                    {isDue && <View style={styles.redDot} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.progressContainer}>
                        <Progress.Bar
                            progress={progress}
                            width={null}
                            height={14}
                            borderRadius={7}
                            color={progressColor}
                            unfilledColor="#e0f2f1"
                            style={styles.progress}
                        />
                        {isDue && (
                            <Image
                                source={require('../assets/alarm.png')}
                                style={styles.progressIcon}
                            />
                        )}
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.subText}>
                            시작일: {formatDate(alarm.createdAt)}
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
        marginVertical: 4,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#bdbdbd',
    },
    dueWrapper: {
        borderColor: '#757575',
        backgroundColor: '#e8f5e9',
    },
    container: {
        backgroundColor: '#fff',
        padding: 12,
    },
    dueContainer: {
        backgroundColor: '#e8f5e9',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 8,
        flexShrink: 1,
    },
    actions: {
        flexDirection: 'row',
    },
    refreshButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    refreshButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    redDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#f44336',
        marginLeft: 4,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    progressContainer: {
        marginTop: 8,
        justifyContent: 'center',
        position: 'relative',
    },
    progress: {},
    progressIcon: {
        position: 'absolute',
        right: -10,
        top: '50%',
        width: 20,
        height: 20,
        resizeMode: 'contain',
        transform: [{ translateY: -10 }],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
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

