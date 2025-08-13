const languageTag = Intl.DateTimeFormat().resolvedOptions().locale;
export const language = languageTag.startsWith('ko') ? 'ko' : 'en';
export const dateLocale = language === 'ko' ? 'ko-KR' : 'en-US';

const translations: Record<string, Record<string, string>> = {
  en: {
    myAlarms: 'My Alarms',
    addAlarm: 'Add Alarm',
    alarmTitle: 'Alarm Title',
    alarmTitlePlaceholder: 'e.g., Replace toothbrush',
    interval: 'Interval (days)',
    intervalPlaceholder: 'e.g., 30',
    cancel: 'Cancel',
    add: 'Add',
    editAlarm: 'Edit Alarm',
    startDate: 'Start Date',
    save: 'Save',
    refresh: 'Reset',
    edit: 'Edit',
    delete: 'Delete',
    startDateLabel: 'Start:',
    remainingDays: 'Remaining days:',
    days: ' days',
    confirm: 'Confirm',
    nameError: 'Please enter alarm title.',
    intervalError: 'Interval must be a number greater than or equal to 1.',
  },
  ko: {
    myAlarms: '내 알람',
    addAlarm: '알람 등록',
    alarmTitle: '알람 제목',
    alarmTitlePlaceholder: '예: 칫솔 교체',
    interval: '주기 (일)',
    intervalPlaceholder: '예: 30',
    cancel: '취소',
    add: '등록',
    editAlarm: '알람 수정',
    startDate: '시작일',
    save: '저장',
    refresh: '갱신',
    edit: '수정',
    delete: '삭제',
    startDateLabel: '시작일:',
    remainingDays: '남은 일수:',
    days: '일',
    confirm: '확인',
    nameError: '알람 제목을 입력해 주세요.',
    intervalError: '주기는 1 이상의 숫자여야 합니다.',
  },
};

export const t = (key: string): string => {
  return translations[language][key] || translations.en[key] || key;
};
