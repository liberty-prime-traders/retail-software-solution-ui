import {signal} from '@angular/core'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {PaymentTypeSummary, PaymentSummary} from '../../../../api/location-level/payment/payment-summary.model'
import {PaymentSummaryService} from '../../../../api/location-level/payment/payment-summary.service'
import {PaymentType} from '../../../../api/location-level/payment/payment-type.enum'
import {BalanceEffect} from '../../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {PaymentsSummaryComponent} from './payments-summary.component'
import {buildSummaryGridRows} from './summary-grid-row'

describe('PaymentsSummaryComponent', () => {
  let fixture: ComponentFixture<PaymentsSummaryComponent>
  const summarySignal = signal<PaymentSummary | undefined>(undefined)

  const salesBlock = (): PaymentTypeSummary => ({
    type: PaymentType.SALE,
    balanceEffect: BalanceEffect.ADDS,
    activeTotal: 300, voidedTotal: 20, activeCount: 3, voidedCount: 1,
    methods: [
      {paymentMethodId: 'm1', paymentMethodName: 'CASH', activeTotal: 200, voidedTotal: 0},
      {paymentMethodId: 'm2', paymentMethodName: 'MPESA', activeTotal: 100, voidedTotal: 20}
    ]
  })

  const purchasesBlock = (): PaymentTypeSummary => ({
    type: PaymentType.PURCHASE,
    balanceEffect: BalanceEffect.SUBTRACTS,
    activeTotal: 50, voidedTotal: 0, activeCount: 1, voidedCount: 0,
    methods: [{paymentMethodId: 'm1', paymentMethodName: 'BANK', activeTotal: 50, voidedTotal: 0}]
  })

  const render = (sales: PaymentTypeSummary | null, purchases: PaymentTypeSummary | null) => {
    const summaries = [sales, purchases].filter((block): block is PaymentTypeSummary => !!block)
    summarySignal.set({id: 'summary', summaries} as unknown as PaymentSummary)
    fixture.detectChanges()
  }

  const element = () => fixture.nativeElement as HTMLElement
  const cardTitles = () => Array.from(element().querySelectorAll('p-panel .p-panel-title, p-panel .p-panel-header'))
    .map(header => header.textContent?.trim())

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: PaymentSummaryService, useValue: {paymentSummary: summarySignal}}]
    })
    fixture = TestBed.createComponent(PaymentsSummaryComponent)
  })

  it('shows only the sales cards and rows when purchases is null', () => {
    render(salesBlock(), null)

    expect(cardTitles()).toEqual(['Total Active Sales (3)', 'Total Voided Sales (1)'])
    expect(element().textContent).toContain('Sales')
    expect(element().textContent).not.toContain('Purchases')
  })

  it('shows only the purchases cards and rows when sales is null', () => {
    render(null, purchasesBlock())

    expect(cardTitles()).toEqual(['Total Active Purchases (1)', 'Total Voided Purchases (0)'])
    expect(element().textContent).not.toContain('Sales')
  })

  it('shows four cards in order and both types when both blocks are present', () => {
    render(salesBlock(), purchasesBlock())

    expect(cardTitles()).toEqual([
      'Total Active Sales (3)', 'Total Voided Sales (1)', 'Total Active Purchases (1)', 'Total Voided Purchases (0)'
    ])
  })

  it('shows the empty state when neither type is present', () => {
    render(null, null)

    expect(element().textContent).toContain('Tick Sale or Purchase to see totals')
    expect(element().querySelector('table')).toBeNull()
  })

  it('spans the Type cell across the type rows and renders it once per type', () => {
    render(salesBlock(), purchasesBlock())

    const typeCells = Array.from(element().querySelectorAll('td.type-cell'))
    expect(typeCells.map(cell => cell.textContent?.trim())).toEqual(['Sales', 'Purchases'])
    expect(typeCells.map(cell => cell.getAttribute('rowspan'))).toEqual(['3', '2'])
  })

  it('indents payment methods but not the Total row', () => {
    render(salesBlock(), null)

    const labelCells = Array.from(element().querySelectorAll('tbody tr')).map(row => row.querySelectorAll('td')[1])
    expect(labelCells.map(cell => cell.classList.contains('method-label'))).toEqual([true, true, false])
  })

  it('bolds the Total row and colours its Active value by balance effect', () => {
    render(salesBlock(), purchasesBlock())

    const totalRows = Array.from(element().querySelectorAll('tbody tr')).filter(row => row.classList.contains('font-bold'))
    expect(totalRows.length).toBe(2)
    expect(totalRows[0].querySelector('.money-in')).not.toBeNull()
    expect(totalRows[1].querySelector('.money-out')).not.toBeNull()
    expect(totalRows[0].querySelectorAll('td')[3].classList.contains('irregular-balance')).toBeTrue()
  })

  it('builds rows whose Total equals the section totals and sets the rowspan on the first row only', () => {
    const rows = buildSummaryGridRows({id: 'summary', summaries: [salesBlock()]} as unknown as PaymentSummary)

    expect(rows.map(row => row.typeCell)).toEqual([{label: 'Sales', rowSpan: 3}, null, null])
    expect(rows.map(row => row.kind)).toEqual(['method', 'method', 'total'])
    expect(rows[2].balanceEffect).toBe(BalanceEffect.ADDS)
  })
})
