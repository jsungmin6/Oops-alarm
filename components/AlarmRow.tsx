import React, { useRef, useEffect } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
    AccessibilityInfo,
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
    const backgroundColor = '#f0fff4'
    const borderColor = '#A5D6A7'

    const glowAnim = useRef(new Animated.Value(0)).current
    useEffect(() => {
        let animation: Animated.CompositeAnimation | undefined
        let mounted = true
        if (isDue) {
            AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
                if (reduce || !mounted) return
                animation = Animated.loop(
                    Animated.sequence([
                        Animated.timing(glowAnim, {
                            toValue: 1,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(glowAnim, {
                            toValue: 0,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                    ])
                )
                animation.start()
            })
        }
        return () => {
            mounted = false
            animation && animation.stop()
        }
    }, [isDue, glowAnim])

    const ACTION_WIDTH = 60

    const renderRightActions = () => (
        <View style={[styles.actionsContainer, { width: ACTION_WIDTH * 2 }]}>
            <TouchableOpacity
                ref={editRef}
                onPress={() => onEdit(alarm, editRef.current, swipeableRef.current)}
                style={[styles.action, styles.editAction, { width: ACTION_WIDTH }]}
            >
                <Text style={styles.actionLabel}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => deleteAlarm(alarm.id)}
                style={[styles.action, styles.deleteAction, { width: ACTION_WIDTH }]}
            >
                <Text style={styles.actionLabel}>삭제</Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View
            style={[
                styles.wrapper,
                { borderColor, backgroundColor },
            ]}
        >
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                overshootRight={false}
                friction={3}
                rightThreshold={40}
                useNativeAnimations={false}
            >
                <View style={[styles.container, { backgroundColor }]}>
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
                                style={[
                                    styles.refreshButton,
                                    { backgroundColor: progressColor },
                                ]}
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
                            borderColor={progressColor}
                            unfilledColor="#e0f2f1"
                            style={styles.progress}
                        />
                        {isDue && (
                            <Animated.View
                                pointerEvents="none"
                                style={[
                                    StyleSheet.absoluteFillObject,
                                    styles.glowOverlay,
                                    {
                                        opacity: glowAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.3, 0.7],
                                        }),
                                    },
                                ]}
                            />
                        )}
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
        marginVertical: 8,
        borderRadius: 6,
        overflow: 'hidden',
        borderWidth: 2,
    },
    container: {
        padding: 12,
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
        right: -16,
        top: '50%',
        width: 32,
        height: 32,
        resizeMode: 'contain',
        transform: [{ translateY: -16 }],
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
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
        flexDirection: 'row',
    },
    glowOverlay: {
        borderRadius: 7,
        shadowColor: '#FFD700',
        shadowOpacity: 1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
        elevation: 3,
    },
    action: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    editAction: {
        backgroundColor: '#81C784',
    },
    deleteAction: {
        backgroundColor: '#388E3C',
    },
    actionLabel: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
})

export default AlarmRow

