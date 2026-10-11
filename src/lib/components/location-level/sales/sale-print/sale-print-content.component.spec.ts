import {Component, signal} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {defaultSaleSession} from '../../../../api/location-level/sale_session/sale-session-default.value'
import {SaleSession} from '../../../../api/location-level/sale_session/sale-session.model'
import {
  UnitConversionGraphService
} from '../../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {PrintDocumentComponent} from '../../../reusable/print'
import {PrintPaperPreset} from '../../../reusable/print'
import {createPresetPrintLayout} from '../../../reusable/print'
import {SalePrintContentComponent} from './sale-print-content.component'

const LONG_NAME = 'Extra-strength weatherproof exterior masonry paint, brilliant white, 20 litre tub (Supercalifragilistic)'

const buildSale = (): SaleSession => {
  const sale = defaultSaleSession()
  return {
    ...sale,
    referenceNumber: 'S-0042',
    contactLabel: 'Ada Lovelace',
    soldBy: 'Charles',
    dateSold: '2026-10-01T10:00:00Z',
    saleStatus: SaleStatus.CONFIRMED,
    saleLines: [
      {
        identity: {id: 'l1'}, locationProductId: 'p1', productLabel: LONG_NAME, quantity: 2, baseQuantity: 2,
        unitId: 'u1', baseUnitId: 'u1', conversionFactor: 1, unitPrice: 1234567.5, lineTotal: 2469135,
        unitPriceOverride: 1234567.5, netUnitPrice: 1234567.5, quantityOnHand: 9, quantityReserved: 0, quantityAvailable: 9
      },
      {
        identity: {id: 'l2'}, locationProductId: 'p2', productLabel: 'Brush', quantity: 1, baseQuantity: 1,
        unitId: 'u1', baseUnitId: 'u1', conversionFactor: 1, unitPrice: 10, lineTotal: 8,
        unitPriceOverride: 8, netUnitPrice: 8, quantityOnHand: 9, quantityReserved: 0, quantityAvailable: 9
      }
    ],
    salePayments: [
      {identity: {id: 'pay1'}, paymentMethod: 'Cash', amount: 100, reference: '', paymentDate: '', voidedReason: ''},
      {identity: {id: 'pay2'}, paymentMethod: 'Card', amount: 5, reference: '', paymentDate: '', voidedReason: 'typo'}
    ],
    totals: {
      ...sale.totals,
      displaySubtotal: 2469143, lineLevelDiscountTotal: 2, receivableTotal: 2469141, paymentTotal: 100, balance: 2469041
    }
  }
}

@Component({
  imports: [PrintDocumentComponent, SalePrintContentComponent],
  template: `
    <rts-print-document [layout]="layout()">
      <rts-sale-print-content [sale]="sale()" [layout]="layout()" />
    </rts-print-document>
  `
})
class HostComponent {
  readonly sale = signal(buildSale())
  readonly layout = signal(createPresetPrintLayout(PrintPaperPreset.A4))
}

describe('SalePrintContentComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>
  let root: HTMLElement

  const render = (preset: PrintPaperPreset) => {
    fixture.componentInstance.layout.set(createPresetPrintLayout(preset))
    fixture.detectChanges()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: UnitConversionGraphService, useValue: {getUnitLabel: () => 'tub'}}]
    })
    fixture = TestBed.createComponent(HostComponent)
    root = fixture.nativeElement
    document.body.appendChild(root)
    fixture.detectChanges()
  })

  afterEach(() => root.remove())

  it('renders a table for sheets', () => {
    expect(root.querySelector('table.sheet-lines')).not.toBeNull()
    expect(root.querySelector('.receipt')).toBeNull()
    expect(root.querySelectorAll('tbody tr').length).toBe(2)
  })

  it('renders a stacked list instead of a table for receipts', () => {
    render(PrintPaperPreset.RECEIPT_80MM)
    expect(root.querySelector('table')).toBeNull()
    expect(root.querySelectorAll('.receipt-line').length).toBe(2)
  })

  it('uses the compact receipt structure only on the 58 mm roll', () => {
    render(PrintPaperPreset.RECEIPT_58MM)
    expect(root.querySelector('.receipt-compact')).not.toBeNull()
    render(PrintPaperPreset.RECEIPT_80MM)
    expect(root.querySelector('.receipt-compact')).toBeNull()
  })

  it('shows the payment reference under its method on receipts', () => {
    const sale = fixture.componentInstance.sale()
    fixture.componentInstance.sale.set({
      ...sale,
      salePayments: sale.salePayments.map(payment => ({...payment, reference: payment.voidedReason ? '' : 'QWE123'}))
    })
    render(PrintPaperPreset.RECEIPT_58MM)
    const payments = root.querySelectorAll('.receipt-payment')
    expect(payments.length).toBe(1)
    expect(payments[0].querySelector('.receipt-payment-reference')?.textContent).toContain('QWE123')
  })

  it('shows the original price of an overridden line on receipts', () => {
    for (const preset of [PrintPaperPreset.RECEIPT_80MM, PrintPaperPreset.RECEIPT_58MM]) {
      render(preset)
      expect(root.querySelectorAll('.receipt .was').length).withContext(preset).toBe(1)
    }
  })

  it('shows the sale-provided totals and omits zero adjustment rows', () => {
    const text = root.textContent ?? ''
    expect(text).toContain('Balance due')
    expect(text).toContain('Line discounts')
    expect(text).not.toContain('Order discounts')
    expect(text).not.toContain('Line surcharges')
  })

  it('omits voided payments', () => {
    const text = root.textContent ?? ''
    expect(text).toContain('Cash')
    expect(text).not.toContain('Card')
  })

  it('flags the original price of an overridden line', () => {
    expect(root.querySelectorAll('.was').length).toBe(1)
  })

  for (const preset of [PrintPaperPreset.RECEIPT_58MM, PrintPaperPreset.RECEIPT_80MM]) {
    it(`does not overflow horizontally on ${preset} with a long item name and large amounts`, () => {
      render(preset)
      const surface = root.querySelector('rts-print-document') as HTMLElement
      expect(surface.scrollWidth).withContext('document').toBeLessThanOrEqual(surface.clientWidth + 1)

      root.querySelectorAll<HTMLElement>('.receipt .money').forEach(money => {
        expect(money.getBoundingClientRect().right).withContext('amount inside paper')
          .toBeLessThanOrEqual(surface.getBoundingClientRect().right + 1)
      })
      root.querySelectorAll<HTMLElement>('.receipt .row').forEach(row => {
        const label = row.querySelector<HTMLElement>('.row-label')!.getBoundingClientRect()
        const money = row.querySelector<HTMLElement>('.money')!.getBoundingClientRect()
        const besideEachOther = label.right <= money.left + 1
        const amountBelowLabel = label.bottom <= money.top + 1
        expect(besideEachOther || amountBelowLabel).withContext('label does not overlap amount').toBeTrue()
      })
    })
  }
})
