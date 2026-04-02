const en = {
  home: {
    title: 'My alarms',
    alarmToggleLabel: 'Alarm',
  },
  common: {
    add: 'Add',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    refresh: 'Refresh',
    save: 'Save',
    confirm: 'Confirm',
  },
  modal: {
    addTitle: 'Add alarm',
    editTitle: 'Edit alarm',
    nameLabel: 'Alarm name',
    intervalLabel: 'Interval (days)',
    startDateLabel: 'Start date',
    namePlaceholder: 'Example: Replace toothbrush',
    intervalPlaceholder: 'Example: 30',
  },
  validation: {
    nameRequired: 'Please enter an alarm name.',
    intervalInvalid: 'Interval must be a number greater than or equal to 1.',
  },
  alarm: {
    startDate: 'Start date: %{date}',
    remainingDays: 'Days left: %{count}',
  },
  notifications: {
    channelName: 'Due today reminders',
    dueTodayTitle: 'You have something to do today',
    dueTodayBody: 'It is time to check %{name}',
    multipleDueBody: 'You have %{count} things to do',
    permissionsDenied: 'Device notification permission is off, so alarm reminders cannot be delivered.',
    alarmsOff: 'The alarm toggle is off, so test reminders are also blocked.',
    testTitle: 'Test reminder',
    testBody: 'This is a test reminder for %{name}.',
    testScheduledTitle: 'Test reminder scheduled',
    testScheduledBody: '%{name} will be delivered once in 10 seconds.',
  },
} as const

export default en
