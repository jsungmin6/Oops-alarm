import React, { useMemo } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import AlarmRow from './AlarmRow'
import { Alarm } from '../types/Alarm'
import { Swipeable } from 'react-native-gesture-handler'

type Props = {
    alarms: Alarm[]
    deleteAlarm: (id: string) => void
    updateAlarmDate: (id: string) => void
    onEdit: (
        alarm: Alarm,
        triggerRef: any,
        swipeableRef: Swipeable | null
    ) => void
    footer?: React.ReactElement | null
}

const AlarmList = ({
    alarms,
    deleteAlarm,
    updateAlarmDate,
    onEdit,
    footer,
}: Props) => {
    const sortedAlarms = useMemo(() => {
        const now = new Date()
        return [...alarms].sort((a, b) => {
            const diffA = Math.floor(
                (now.getTime() - new Date(a.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
            )
            const diffB = Math.floor(
                (now.getTime() - new Date(b.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
            )
            const remainingA = Math.max(a.interval - diffA, 0)
            const remainingB = Math.max(b.interval - diffB, 0)
            if (remainingA === remainingB) {
                return a.name.localeCompare(b.name)
            }
            return remainingA - remainingB
        })
    }, [alarms])

    return (
        <FlatList
            data={sortedAlarms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <AlarmRow
                    alarm={item}
                    deleteAlarm={deleteAlarm}
                    updateAlarmDate={updateAlarmDate}
                    onEdit={onEdit}
                />
            )}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={footer}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: 16,
    },
})

export default AlarmList

