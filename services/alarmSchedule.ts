import { Alarm } from '../types/Alarm'

const MS_PER_DAY = 1000 * 60 * 60 * 24

export const startOfDay = (value: Date | string | number) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export const setReminderTime = (value: Date, hour = 6) => {
  const date = new Date(value)
  date.setHours(hour, 0, 0, 0)
  return date
}

const getElapsedWholeDays = (from: Date, to: Date) =>
  Math.max(0, Math.floor((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY))

export const getAlarmStatus = (alarm: Alarm, now = new Date()) => {
  const interval = Math.max(1, alarm.interval)
  const elapsedDays = getElapsedWholeDays(new Date(alarm.createdAt), now)

  if (elapsedDays >= interval) {
    return {
      elapsedDays,
      interval,
      isDueToday: true,
      progress: 1,
      remainingDays: 0,
    }
  }

  return {
    elapsedDays,
    interval,
    isDueToday: false,
    progress: elapsedDays / interval,
    remainingDays: interval - elapsedDays,
  }
}

export const getNextDueDay = (alarm: Alarm, now = new Date()): Date => {
  const createdAt = startOfDay(alarm.createdAt)
  const { interval, isDueToday } = getAlarmStatus(alarm, now)

  if (isDueToday) {
    return startOfDay(now)
  }

  const dueDate = new Date(createdAt)
  dueDate.setDate(dueDate.getDate() + interval)
  return startOfDay(dueDate)
}

export const getNotificationSlots = (
  alarms: Alarm[],
  followUpDays: number,
  now = new Date()
): Record<string, Alarm[]> => {
  const slots: Record<string, Alarm[]> = {}

  for (const alarm of alarms) {
    const dueDay = getNextDueDay(alarm, now)

    for (let i = 0; i <= followUpDays; i++) {
      const day = new Date(dueDay)
      day.setDate(day.getDate() + i)
      const key = day.toISOString().slice(0, 10)

      if (!slots[key]) slots[key] = []
      if (!slots[key].some((a) => a.id === alarm.id)) {
        slots[key].push(alarm)
      }
    }
  }

  return slots
}
