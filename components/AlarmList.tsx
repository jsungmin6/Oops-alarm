import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import AlarmRow from './AlarmRow'
import { Alarm } from '../types/Alarm'

type Props = {
    alarms: Alarm[]
    deleteAlarm: (id: string) => void
    updateAlarmDate: (id: string) => void
    onEdit: (alarm: Alarm) => void
    footer?: React.ReactElement | null
}

const AlarmList = ({
    alarms,
    deleteAlarm,
    updateAlarmDate,
    onEdit,
    footer,
}: Props) => (
    <FlatList
        data={alarms}
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
        ListFooterComponent={footer ?? null}
    />
)

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingBottom: 32,
    },
})

export default AlarmList

