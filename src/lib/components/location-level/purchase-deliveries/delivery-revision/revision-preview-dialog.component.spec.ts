import {ComponentFixture, TestBed} from '@angular/core/testing'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'
import {
  DeliveryLineRevisionPreview
} from '../../../../api/location-level/delivery-revision/delivery-line-revision-preview.model'
import {RevisionPreviewSeverity} from '../../../../api/location-level/delivery-revision/revision-preview-severity.enum'
import {PurchaseDeliveryLine} from '../../../../api/location-level/delivery/purchase-delivery.model'
import {BalanceEffect} from '../../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {RevisionPreviewDialogComponent} from './revision-preview-dialog.component'

describe('RevisionPreviewDialogComponent', () => {
  let fixture: ComponentFixture<RevisionPreviewDialogComponent>

  const preview = (): DeliveryLineRevisionPreview => ({
    revisedDeliveryLineReferenceNumber: 'PCDLL1',
    changeSummary: '30 Kilograms at KES 220.00 becomes 12 Kilograms at KES 20.00.',
    transactions: [{
      severity: RevisionPreviewSeverity.BLOCKS_SAVE, documentReference: 'SAL1150',
      description: 'Sale that took 2 Kilograms.', effect: 'Only 2 Kilograms could be covered.'
    }],
    guidance: [
      {segments: [{text: 'SAL1150', emphasis: true}, {text: ' cannot be fully covered.', emphasis: false}]},
      {segments: [{text: 'Check which of these is true:', emphasis: false}]}
    ],
    ledgerEntries: [{
      source: 'Purchase delivery revision',
      description: 'This delivery line used to be worth KES 6,600.00.',
      lines: [
        {accountText: 'Trade Payables (decreases)', debit: 6200, balanceEffect: BalanceEffect.ADDS},
        {accountText: 'Inventory (decreases)', credit: 6200, balanceEffect: BalanceEffect.SUBTRACTS}
      ]
    }],
    blocksSaveCount: 1,
    warningCount: 0,
    blocksSave: true
  } as unknown as DeliveryLineRevisionPreview)

  const bodyText = () => document.body.textContent ?? ''
  const occurrencesOf = (text: string) => bodyText().split(text).length - 1

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [NoopAnimationsModule]})
    fixture = TestBed.createComponent(RevisionPreviewDialogComponent)
    fixture.componentRef.setInput('preview', preview())
    fixture.componentRef.setInput('deliveryLine', {
      purchaseLineId: 'line', unitId: 'unit', quantityDelivered: 30, unitCost: 220,
      locationProduct: {name: 'Khaki Bags'}
    } as unknown as PurchaseDeliveryLine)
    fixture.componentRef.setInput('visible', true)
    fixture.detectChanges()
  })

  afterEach(() => fixture.destroy())

  it('has one tab and one panel for each of transactions, guidance and ledger entries', () => {
    expect(occurrencesOf('Transactions')).toBe(1)
    expect(occurrencesOf('What can I do')).toBe(1)
    expect(occurrencesOf('Ledger entries')).toBe(1)
    expect(document.body.querySelectorAll('[role="tabpanel"]').length).toBe(3)
  })

  it('shows each guidance paragraph once', () => {
    expect(occurrencesOf('cannot be fully covered.')).toBe(1)
    expect(occurrencesOf('Check which of these is true:')).toBe(1)
  })

  it('shows the server wording of each ledger line and the totals of the amounts', () => {
    expect(occurrencesOf('Trade Payables (decreases)')).toBe(1)
    expect(occurrencesOf('Inventory (decreases)')).toBe(1)
    expect(bodyText()).toContain('Total')
    expect(bodyText().split('6,200.00').length - 1).toBeGreaterThanOrEqual(4)
  })
})
