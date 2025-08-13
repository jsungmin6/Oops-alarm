import React, { useRef, useEffect, useState } from 'react'
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

    const ACTION_WIDTH = 60

    const glowAnim = useRef(new Animated.Value(0)).current
    const shimmerAnim = useRef(new Animated.Value(0)).current
    const spinAnim = useRef(new Animated.Value(0)).current
    const [barWidth, setBarWidth] = useState(0)

    useEffect(() => {
        if (isDue) {
            const glowLoop = Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                ])
            )
            const shimmerLoop = Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            )
            const spinLoop = Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                })
            )
            glowLoop.start()
            shimmerLoop.start()
            spinLoop.start()
            return () => {
                glowLoop.stop()
                shimmerLoop.stop()
                spinLoop.stop()
            }
        } else {
            glowAnim.setValue(0)
            shimmerAnim.setValue(0)
            spinAnim.setValue(0)
        }
    }, [isDue, glowAnim, shimmerAnim, spinAnim])

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
                        <View
                            style={styles.progressBarWrapper}
                            onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
                        >
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
                                <>
                                    <Animated.View
                                        pointerEvents="none"
                                        style={[
                                            styles.glowOverlay,
                                            {
                                                opacity: glowAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.3, 0.9],
                                                }),
                                                transform: [
                                                    {
                                                        scale: glowAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [1, 1.2],
                                                        }),
                                                    },
                                                ],
                                                backgroundColor: progressColor,
                                            },
                                        ]}
                                    />
                                    <Animated.View
                                        pointerEvents="none"
                                        style={[
                                            styles.shimmerOverlay,
                                            {
                                                width: barWidth * 0.3,
                                                transform: [
                                                    {
                                                        translateX: shimmerAnim.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [-barWidth, barWidth],
                                                        }),
                                                    },
                                                    { rotate: '20deg' },
                                                ],
                                            },
                                        ]}
                                    />
                                </>
                            )}
                        </View>
                        {isDue && (
                            <Animated.Image
                                source={require('../assets/alarm.png')}
                                style={[
                                    styles.progressIcon,
                                    {
                                        transform: [
                                            { translateY: -16 },
                                            {
                                                rotate: spinAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0deg', '360deg'],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
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
        borderRadius: 16,
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
        fontFamily: 'Jua-Regular',
        marginRight: 8,
        flexShrink: 1,
        fontFamily: 'Jua-Regular',
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
        backgroundColor: '#ff6347',
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
    progressBarWrapper: {
        overflow: 'hidden',
    },
    progress: {},
    glowOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 7,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 6,
        elevation: 4,
    },
    shimmerOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 7,
    },
    progressIcon: {
        position: 'absolute',
        right: -16,
        top: '50%',
        width: 32,
        height: 32,
        resizeMode: 'contain',
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
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        flexDirection: 'row',
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

