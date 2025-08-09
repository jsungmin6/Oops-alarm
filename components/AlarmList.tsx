import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Alarm } from '../types/Alarm'
import AlarmRow from './AlarmRow'

type Props = {
    alarms: Alarm[]
    onEdit: (id: string) => void
    updateAlarmDate: (id: string) => void
    deleteAlarm: (id: string) => void
}

const AlarmList = ({ alarms, onEdit, updateAlarmDate, deleteAlarm }: Props) => {
    return (
        <FlatList
            data={alarms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <AlarmRow
                    alarm={item}
                    onEdit={onEdit}
                    updateAlarmDate={updateAlarmDate}
                    deleteAlarm={deleteAlarm}
                />
            )}
            contentContainerStyle={styles.content}
        />
    )
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
        paddingBottom: 80,
    },
})

export default AlarmList

