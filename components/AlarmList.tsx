import React from 'react'
import {
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from 'react-native'
import AlarmRow from './AlarmRow'
import { Alarm } from '../types/Alarm'

type Props = {
    alarms: Alarm[]
    deleteAlarm: (id: string) => void
    updateAlarmDate: (id: string) => void
    onEdit: (alarm: Alarm) => void
    onAdd: () => void
}

const AlarmList = ({
    alarms,
    deleteAlarm,
    updateAlarmDate,
    onEdit,
    onAdd,
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
        ListFooterComponent=
            <View style={styles.footer}>
                <TouchableOpacity onPress={onAdd} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
    />
)

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingBottom: 16,
    },
    footer: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    addButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
    },
})

export default AlarmList

