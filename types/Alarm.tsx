// types/Alarm.ts
export interface Alarm {
    id: string            // UUID
    name: string          // 알람 이름
    interval: number      // 주기 (일)
    createdAt: string     // 시작일 (ISO 문자열)
}
