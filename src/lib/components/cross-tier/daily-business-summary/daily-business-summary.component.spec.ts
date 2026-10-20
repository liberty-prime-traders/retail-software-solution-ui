import {DatePipe} from '@angular/common'
import {provideHttpClient} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting, TestRequest} from '@angular/common/http/testing'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {TIMEZONE_TOKEN} from '@global/utils/timezones.config'
import {DailyBalances} from '../../../api/cross-tier/daily-business-summary/daily-balances.model'
import {
  DailyPerformance,
  DailyPerformanceDay
} from '../../../api/cross-tier/daily-business-summary/daily-performance.model'
import {PeriodStatus} from '../../../api/cross-tier/daily-business-summary/period-status.enum'
import {DailyBusinessSummaryComponent, SummaryTab} from './daily-business-summary.component'
import {DateRangePreset} from './date-range-preset.enum'
import {emptyFigures, sampleBalances} from './summary-view.util.spec'

const PERFORMANCE_URL = '/secured/daily-business-summary/performance'
const BALANCES_URL = '/secured/daily-business-summary/balances'

describe('DailyBusinessSummaryComponent', () => {
  let fixture: ComponentFixture<DailyBusinessSummaryComponent>
  let component: DailyBusinessSummaryComponent
  let http: HttpTestingController

  const performanceFor = (dates: string[], netMarginPercent: number | null = 10): DailyPerformance => ({
    id: 'daily-performance',
    asOf: '2026-03-10T09:00:00Z',
    rangeStatus: PeriodStatus.COMPLETE,
    days: dates.map((date): DailyPerformanceDay => ({
      date, status: PeriodStatus.COMPLETE, figures: {...emptyFigures(), netSales: 100, netProfit: 10, netMarginPercent}
    })),
    totals: {...emptyFigures(), netSales: 100 * dates.length, netProfit: 10 * dates.length, netMarginPercent}
  } as DailyPerformance)

  const balancesFor = (dates: string[]): DailyBalances => ({
    id: 'daily-balances',
    asOf: '2026-03-10T09:00:00Z',
    rangeStatus: PeriodStatus.COMPLETE,
    days: dates.map(date => ({date, status: PeriodStatus.COMPLETE, balances: sampleBalances()})),
    rangeBalances: sampleBalances()
  } as DailyBalances)

  const lastFourteenDays = Array.from({length: 14}, (_, offset) => `2026-02-${String(24 + offset).padStart(2, '0')}`)
    .map(date => date > '2026-02-28' ? `2026-03-${String(Number(date.slice(8)) - 28).padStart(2, '0')}` : date)

  const pendingRequests = () => ({
    performance: http.match(request => request.url === PERFORMANCE_URL),
    balances: http.match(request => request.url === BALANCES_URL)
  })

  const flush = (request: TestRequest, body: object) => request.flush(body)

  beforeEach(() => {
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date('2026-03-10T09:00:00Z'))
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe,
        {provide: TIMEZONE_TOKEN, useValue: 'UTC'}
      ]
    })
    http = TestBed.inject(HttpTestingController)
    fixture = TestBed.createComponent(DailyBusinessSummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => jasmine.clock().uninstall())

  it('defaults to yesterday, fires both requests together and focuses yesterday', () => {
    const {performance, balances} = pendingRequests()

    expect(component.preset()).toBe(DateRangePreset.YESTERDAY)
    expect(performance.length).toBe(1)
    expect(balances.length).toBe(1)
    expect(performance[0].request.body).toEqual({from: '2026-02-24', before: '2026-03-10'})
    expect(component.focusedDate()).toBe('2026-03-09')
  })

  it('cancels the in-flight requests when a new range is chosen', () => {
    const first = pendingRequests()

    component.onPresetChange(DateRangePreset.LAST_7_DAYS)

    expect(first.performance[0].cancelled).toBeTrue()
    expect(first.balances[0].cancelled).toBeTrue()
    expect(pendingRequests().performance[0].request.body).toEqual({from: '2026-03-03', before: '2026-03-10'})
  })

  it('renders the performance parts while balances are still loading', () => {
    const {performance} = pendingRequests()
    flush(performance[0], performanceFor(lastFourteenDays))
    fixture.detectChanges()

    expect(component.performanceLoading()).toBeFalse()
    expect(component.balancesLoading()).toBeTrue()
    expect(component.performanceFigures()).toBeDefined()
  })

  it('a balances failure leaves the performance flow intact', () => {
    const {performance, balances} = pendingRequests()
    flush(performance[0], performanceFor(lastFourteenDays))
    balances[0].flush({message: 'boom'}, {status: 500, statusText: 'Server Error'})
    fixture.detectChanges()

    expect(component.balancesFailed()).toBeTrue()
    expect(component.performanceFailed()).toBeFalse()
    expect(component.performance()?.days.length).toBe(14)
  })

  it('switching tabs keeps the focus and fires no request', () => {
    const {performance, balances} = pendingRequests()
    flush(performance[0], performanceFor(lastFourteenDays))
    flush(balances[0], balancesFor(lastFourteenDays))
    component.focusDay('2026-03-02')

    component.onTabChange(SummaryTab.NET_WORTH)

    expect(component.focusedDate()).toBe('2026-03-02')
    http.expectNone(request => request.url === PERFORMANCE_URL || request.url === BALANCES_URL)
  })

  it('focusing a day shows that day and show whole range restores the totals without a request', () => {
    const {performance, balances} = pendingRequests()
    const response = performanceFor(lastFourteenDays)
    response.days[1].figures = {...response.days[1].figures, netSales: 555}
    flush(performance[0], response)
    flush(balances[0], balancesFor(lastFourteenDays))

    component.focusDay(response.days[1].date)
    expect(component.performanceFigures()!.netSales).toBe(555)

    component.showWholeRange()
    expect(component.performanceFigures()!.netSales).toBe(1400)
    http.expectNone(request => request.url === PERFORMANCE_URL || request.url === BALANCES_URL)
  })

  it('the net worth tiles come from the focused day balances', () => {
    const {performance, balances} = pendingRequests()
    flush(performance[0], performanceFor(lastFourteenDays))
    const response = balancesFor(lastFourteenDays)
    response.days[2].balances = {...sampleBalances(), netWorth: 42}
    flush(balances[0], response)

    component.focusDay(response.days[2].date)

    expect(component.balanceSections()!.netWorth).toBe(42)
    component.showWholeRange()
    expect(component.balanceSections()!.netWorth).toBe(2000)
  })

  it('rejects a custom range over 92 days without loading it', () => {
    pendingRequests()

    component.onPresetChange(DateRangePreset.CUSTOM)
    component.onCustomRangeChange([new Date(2026, 0, 1), new Date(2026, 3, 5)])

    expect(component.customRangeTooLong()).toBeTrue()
    http.expectNone(request => request.url === PERFORMANCE_URL || request.url === BALANCES_URL)
  })

  it('loads a valid custom range with the last day made exclusive', () => {
    pendingRequests()

    component.onPresetChange(DateRangePreset.CUSTOM)
    component.onCustomRangeChange([new Date(2026, 2, 1), new Date(2026, 2, 5)])

    expect(component.customRangeTooLong()).toBeFalse()
    expect(pendingRequests().performance[0].request.body).toEqual({from: '2026-03-01', before: '2026-03-06'})
  })

  it('hides the margin sub-labels when the margins are null', () => {
    const {performance} = pendingRequests()
    flush(performance[0], performanceFor(lastFourteenDays, null))
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).not.toContain('% margin')
  })
})
