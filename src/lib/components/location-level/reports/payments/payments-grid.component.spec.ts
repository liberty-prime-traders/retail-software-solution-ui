import {signal} from '@angular/core'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {TIMEZONE_TOKEN} from '@global/utils/timezones.config'
import {PaymentRow} from '../../../../api/location-level/payment/payment-search-result.model'
import {PaymentSearchResultService} from '../../../../api/location-level/payment/payment-search-result.service'
import {PaymentType} from '../../../../api/location-level/payment/payment-type.enum'
import {BalanceEffect} from '../../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {PaymentsGridComponent} from './payments-grid.component'

describe('PaymentsGridComponent', () => {
  let fixture: ComponentFixture<PaymentsGridComponent>
  const rows = signal<PaymentRow[]>([])

  const row = (overrides: Partial<PaymentRow>): PaymentRow => ({
    id: 'row-1',
    type: PaymentType.SALE,
    referenceNumber: 'SL000001',
    contactName: 'Jane',
    paymentMethodName: 'CASH',
    amount: 100,
    balanceEffect: BalanceEffect.ADDS,
    paymentDate: '2026-03-10T09:00:00Z',
    recordedOn: '2026-03-10T09:00:00Z',
    voided: false,
    voidedReason: null,
    ...overrides
  } as PaymentRow)

  const bodyRows = () => Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr'))

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: TIMEZONE_TOKEN, useValue: 'UTC'},
        {
          provide: PaymentSearchResultService,
          useValue: {
            selectAll: rows,
            selectLoading: signal(false),
            freshLoadCompleted: signal(0),
            getPaginatedCount: () => 0,
            loadNext: () => undefined
          }
        }
      ]
    })
    fixture = TestBed.createComponent(PaymentsGridComponent)
  })

  it('shows Ref# and Contact headers and each row\'s own reference number for both types', () => {
    rows.set([row({}), row({id: 'row-2', type: PaymentType.PURCHASE, referenceNumber: 'PU000007', contactName: 'Acme'})])
    fixture.detectChanges()

    const headers = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('th')).map(th => th.textContent?.trim())
    expect(headers.slice(0, 2)).toEqual(['Ref#', 'Contact'])
    const text = (fixture.nativeElement as HTMLElement).textContent
    expect(text).toContain('SL000001')
    expect(text).toContain('PU000007')
    expect(text).toContain('Acme')
  })

  it('colours the amount money-in for sales and money-out for purchases', () => {
    rows.set([row({}), row({id: 'row-2', type: PaymentType.PURCHASE, balanceEffect: BalanceEffect.SUBTRACTS})])
    fixture.detectChanges()

    const [saleRow, purchaseRow] = bodyRows()
    expect(saleRow.querySelector('.money-in')).not.toBeNull()
    expect(purchaseRow.querySelector('.money-out')).not.toBeNull()
  })

  it('strikes through voided rows and drops the balance colour while keeping the void reason', () => {
    rows.set([row({voided: true, voidedReason: 'Wrong amount'})])
    fixture.detectChanges()

    const [voidedRow] = bodyRows()
    expect(voidedRow.classList.contains('strike-through')).toBeTrue()
    expect(voidedRow.querySelector('.money-in, .money-out')).toBeNull()
    expect(voidedRow.textContent).toContain('Wrong amount')
  })
})
