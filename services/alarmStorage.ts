import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alarm } from '../types/Alarm'

const ALARMS_STORAGE_KEY = 'alarms'

export const loadAlarmsFromStorage = async () => {
  const json = await AsyncStorage.getItem(ALARMS_STORAGE_KEY)
  return json ? (JSON.parse(json) as Alarm[]) : []
}

export const saveAlarmsToStorage = async (alarms: Alarm[]) => {
  await AsyncStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(alarms))
}
