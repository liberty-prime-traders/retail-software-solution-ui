export enum DateRangePreset {
  YESTERDAY = 'YESTERDAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_14_DAYS = 'LAST_14_DAYS',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  CUSTOM = 'CUSTOM'
}

export const DATE_RANGE_PRESET_OPTIONS: {label: string, value: DateRangePreset}[] = [
  {label: 'Yesterday', value: DateRangePreset.YESTERDAY},
  {label: 'Last 7 days', value: DateRangePreset.LAST_7_DAYS},
  {label: 'Last 14 days', value: DateRangePreset.LAST_14_DAYS},
  {label: 'This month', value: DateRangePreset.THIS_MONTH},
  {label: 'Last month', value: DateRangePreset.LAST_MONTH},
  {label: 'Custom range', value: DateRangePreset.CUSTOM}
]
