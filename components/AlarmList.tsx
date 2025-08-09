import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import AlarmRow from './AlarmRow'
import { Alarm } from '../types/Alarm'

type Props = {
    alarms: Alarm[]
    deleteAlarm: (id: string) => void
    updateAlarmDate: (id: string) => void
    onEdit: (id: string) => void
}

const AlarmList = ({ alarms, deleteAlarm, updateAlarmDate, onEdit }: Props) => (
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
    />
)

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingBottom: 80,
    },
})

export default AlarmList

