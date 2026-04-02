const ko = {
  home: {
    title: '내 알람',
    alarmToggleLabel: '알람',
  },
  common: {
    add: '등록',
    cancel: '취소',
    delete: '삭제',
    edit: '수정',
    refresh: '갱신',
    save: '저장',
    confirm: '확인',
  },
  modal: {
    addTitle: '알람 등록',
    editTitle: '알람 수정',
    nameLabel: '알람 제목',
    intervalLabel: '주기 (일)',
    startDateLabel: '시작일',
    namePlaceholder: '예: 칫솔 교체',
    intervalPlaceholder: '예: 30',
  },
  validation: {
    nameRequired: '알람 제목을 입력해 주세요.',
    intervalInvalid: '주기는 1 이상의 숫자여야 합니다.',
  },
  alarm: {
    startDate: '시작일: %{date}',
    remainingDays: '남은 일수: %{count}일',
  },
  notifications: {
    channelName: '오늘 할 일 알림',
    dueTodayTitle: '오늘 해야 할 일이 있어요',
    dueTodayBody: '%{name} 확인할 시간이에요',
    multipleDueBody: '%{count}개의 할일이 있습니다',
    permissionsDenied: '기기 알림 권한이 꺼져 있어 알람 알림을 보낼 수 없어요.',
    alarmsOff: '알람 토글이 꺼져 있어 테스트 알림도 보내지 않아요.',
    testTitle: '테스트 알림',
    testBody: '%{name} 알람 테스트예요.',
    testScheduledTitle: '테스트 알림 예약됨',
    testScheduledBody: '%{name} 알람이 10초 뒤 한 번 도착해요.',
  },
} as const

export default ko
