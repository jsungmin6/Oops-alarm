import { Alarm } from '../types/Alarm'

const MS_PER_DAY = 1000 * 60 * 60 * 24

export const startOfDay = (value: Date | string | number) => {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export const setReminderTime = (value: Date, hour = 9) => {
  const date = new Date(value)
  date.setHours(hour, 0, 0, 0)
  return date
}

const getElapsedWholeDays = (from: Date, to: Date) =>
  Math.max(0, Math.floor((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY))

export const getAlarmStatus = (alarm: Alarm, now = new Date()) => {
  const interval = Math.max(1, alarm.interval)
  const elapsedDays = getElapsedWholeDays(new Date(alarm.createdAt), now)
  const daysIntoCurrentCycle = elapsedDays % interval
  const isDueToday = elapsedDays > 0 && daysIntoCurrentCycle === 0
  const remainingDays = isDueToday ? 0 : interval - daysIntoCurrentCycle

  return {
    elapsedDays,
    interval,
    isDueToday,
    progress: isDueToday ? 1 : daysIntoCurrentCycle / interval,
    remainingDays,
  }
}

export const getNextReminderDate = (alarm: Alarm, now = new Date()) => {
  const createdAt = startOfDay(alarm.createdAt)
  const { elapsedDays, interval } = getAlarmStatus(alarm, now)
  const cycles = Math.ceil(elapsedDays / interval)
  const nextDueDate = new Date(createdAt)
  nextDueDate.setDate(nextDueDate.getDate() + cycles * interval)

  const reminderDate = setReminderTime(nextDueDate)
  if (reminderDate.getTime() > now.getTime()) {
    return reminderDate
  }

  const nextCycleDate = new Date(nextDueDate)
  nextCycleDate.setDate(nextCycleDate.getDate() + interval)
  return setReminderTime(nextCycleDate)
}
