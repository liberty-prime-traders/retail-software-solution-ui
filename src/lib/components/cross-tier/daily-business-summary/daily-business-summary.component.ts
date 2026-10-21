import {DatePipe} from '@angular/common'
import {Component, computed, inject, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {ButtonDirective} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {Message} from 'primeng/message'
import {SelectButton} from 'primeng/selectbutton'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {DailyBalancesService} from '../../../api/cross-tier/daily-business-summary/daily-balances.service'
import {DailyPerformanceService} from '../../../api/cross-tier/daily-business-summary/daily-performance.service'
import {PeriodStatus} from '../../../api/cross-tier/daily-business-summary/period-status.enum'
import {addDays, formatDayLabel, formatDayRange, toLocaleDate, toLocaleDateString} from '../../../utils/dates'
import {ZonedDatesService} from '../../../utils/services/zoned-dates.service'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {DATE_RANGE_PRESET_OPTIONS, DateRangePreset} from './date-range-preset.enum'
import {NetWorthTabComponent} from './net-worth-tab/net-worth-tab.component'
import {PerformanceTabComponent} from './performance-tab/performance-tab.component'
import {isRangeTooLong, MAXIMUM_RANGE_DAYS, resolvePresetRange, SummaryRange} from './summary-range.util'
import {TODAY_SO_FAR} from './summary-view.util'

export enum SummaryTab {
  PERFORMANCE = 'PERFORMANCE',
  NET_WORTH = 'NET_WORTH'
}

@Component({
  selector: 'rts-daily-business-summary',
  templateUrl: 'daily-business-summary.component.html',
  imports: [
    FormsModule, ButtonDirective, DatePicker, Message, SelectButton, Tab, TabList, TabPanel, TabPanels, Tabs,
    NetWorthTabComponent, PerformanceTabComponent, AutoStretchDirective
  ]
})
export class DailyBusinessSummaryComponent implements OnInit {
  private readonly performanceService = inject(DailyPerformanceService)
  private readonly balancesService = inject(DailyBalancesService)
  private readonly zonedDatesService = inject(ZonedDatesService)
  private readonly datePipe = inject(DatePipe)

  readonly presetOptions = DATE_RANGE_PRESET_OPTIONS
  readonly DateRangePreset = DateRangePreset
  readonly SummaryTab = SummaryTab
  readonly maximumRangeDays = MAXIMUM_RANGE_DAYS

  readonly preset = signal(DateRangePreset.YESTERDAY)
  readonly customRange = signal<Date[] | null>(null)
  readonly customRangeTooLong = signal(false)
  readonly activeTab = signal(SummaryTab.PERFORMANCE)
  readonly focusedDate = signal<string | null>(null)
  readonly maxDate = computed(() => toLocaleDate(this.zonedDatesService.todayAtOrgZone()))
  private readonly loadedRange = signal<SummaryRange | null>(null)

  readonly performance = this.performanceService.selectFirst
  readonly performanceLoading = this.performanceService.selectLoading
  readonly performanceFailed = computed(() => this.performanceService.selectProcessingStatus() === ProcessingStatus.FAILURE)
  readonly balances = this.balancesService.selectFirst
  readonly balancesLoading = this.balancesService.selectLoading
  readonly balancesFailed = computed(() => this.balancesService.selectProcessingStatus() === ProcessingStatus.FAILURE)

  readonly lastDate = computed(() => {
    const range = this.loadedRange()
    return range ? addDays(range.before, -1) : null
  })
  readonly isMultiDay = computed(() => {
    const range = this.loadedRange()
    return !!range && range.before !== addDays(range.from, 1)
  })

  private readonly focusedPerformanceDay = computed(() =>
    this.performance()?.days.find(day => day.date === this.focusedDate()))
  private readonly focusedBalancesDay = computed(() =>
    this.balances()?.days.find(day => day.date === this.focusedDate()))

  readonly performanceFigures = computed(() => this.focusedPerformanceDay()?.figures ?? this.performance()?.totals)
  readonly performancePartial = computed(() => this.focusedPerformanceDay()
    ? this.focusedPerformanceDay()!.status === PeriodStatus.IN_PROGRESS
    : this.performance()?.rangeStatus === PeriodStatus.IN_PROGRESS)
  readonly balanceSections = computed(() => this.focusedBalancesDay()?.balances ?? this.balances()?.rangeBalances)
  readonly balancesPartial = computed(() => this.focusedBalancesDay()
    ? this.focusedBalancesDay()!.status === PeriodStatus.IN_PROGRESS
    : this.balances()?.rangeStatus === PeriodStatus.IN_PROGRESS)

  readonly headerTitle = computed(() => {
    const focusedDate = this.focusedDate()
    const range = this.loadedRange()
    if (focusedDate) {
      const status = (this.focusedPerformanceDay() ?? this.focusedBalancesDay())?.status
      return status === PeriodStatus.IN_PROGRESS ? TODAY_SO_FAR : formatDayLabel(focusedDate)
    }
    return range ? formatDayRange(range.from, addDays(range.before, -1)) : ''
  })

  readonly balancesCardTitle = computed(() => {
    if (this.balancesPartial()) {
      return `Balances now, ${this.datePipe.transform(this.balances()!.asOf, 'h:mm a')}`
    }
    const lastDate = this.focusedDate() ?? this.lastDate()
    return lastDate ? `Balances at end of ${formatDayLabel(lastDate)}` : 'Balances'
  })
  readonly balancesChangeLabel = computed(() => this.focusedDate() ? 'Change' : 'Change over range')
  readonly balancesChangeSuffix = computed(() => this.focusedDate() ? 'on the day' : 'over the range')

  ngOnInit(): void {
    this.onPresetChange(DateRangePreset.YESTERDAY)
  }

  onPresetChange(preset: DateRangePreset | null) {
    if (!preset) {
      return
    }
    this.preset.set(preset)
    const range = resolvePresetRange(preset, this.zonedDatesService.todayAtOrgZone())
    if (range) {
      this.customRangeTooLong.set(false)
      this.loadRange(range)
    } else {
      this.onCustomRangeChange(this.customRange())
    }
  }

  onCustomRangeChange(dates: Date[] | null) {
    this.customRange.set(dates)
    const [first, last] = dates ?? []
    if (!first || !last) {
      return
    }
    const range: SummaryRange = {
      from: toLocaleDateString(first),
      before: addDays(toLocaleDateString(last), 1),
      focusDate: null
    }
    this.customRangeTooLong.set(isRangeTooLong(range))
    if (!this.customRangeTooLong()) {
      this.loadRange(range)
    }
  }

  focusDay(date: string) {
    this.focusedDate.set(date)
  }

  showWholeRange() {
    this.focusedDate.set(null)
  }

  onTabChange(tab: string | number | undefined) {
    this.activeTab.set(tab as SummaryTab)
  }

  retryPerformance() {
    this.performanceService.load(this.parameters())
  }

  retryBalances() {
    this.balancesService.load(this.parameters())
  }

  private loadRange(range: SummaryRange) {
    this.loadedRange.set(range)
    this.focusedDate.set(range.focusDate)
    this.performanceService.load(this.parameters())
    this.balancesService.load(this.parameters())
  }

  private parameters() {
    const {from, before} = this.loadedRange()!
    return {from, before}
  }
}
