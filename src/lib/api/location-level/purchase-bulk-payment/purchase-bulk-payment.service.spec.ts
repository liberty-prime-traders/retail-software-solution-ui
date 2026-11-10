import {provideHttpClient} from '@angular/common/http'
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing'
import {TestBed} from '@angular/core/testing'
import {PaymentStatus} from '../purchase/payment-status.enum'
import {PurchaseStatus} from '../purchase/purchase-status.enum'
import {PurchaseBulkPaymentLine} from './purchase-bulk-payment.model'
import {PurchaseBulkPaymentService} from './purchase-bulk-payment.service'

describe('PurchaseBulkPaymentService', () => {
  let service: PurchaseBulkPaymentService
  let http: HttpTestingController

  const line = (purchaseId: string, overrides: Partial<PurchaseBulkPaymentLine> = {}) => ({
    id: purchaseId,
    referenceNumber: purchaseId,
    purchaseStatus: PurchaseStatus.ORDERED,
    orderedTotal: 100,
    paymentCeiling: 100,
    paidTotal: 0,
    payable: 100,
    paymentStatus: PaymentStatus.UNPAID,
    appliedAmount: 0,
    ...overrides
  }) as PurchaseBulkPaymentLine

  const searchRequest = (supplierId: string) =>
    ({supplierId, orderedFrom: '2026-05-01T00:00:00+03:00', orderedBefore: '2026-11-10T00:00:00+03:00'})

  const purchaseIds = () => service.selectAll().map(purchase => purchase.id)

  const loadPayable = (loaded: PurchaseBulkPaymentLine[]) => {
    service.loadPayable(searchRequest('supplier'))
    http.expectOne('/secured/purchases/bulk-payment/search').flush(loaded)
  }

  const recordPayment = (recorded: PurchaseBulkPaymentLine[]) => {
    service.recordPayment({
      supplierId: 'supplier', purchaseIds: ['a'], amount: 50, paymentMethodId: 'method', paymentDate: '2026-11-09T00:00:00+03:00'
    })
    const request = http.expectOne('/secured/purchases/bulk-payment')
    expect(request.request.method).toBe('POST')
    request.flush(recorded)
  }

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideHttpClient(), provideHttpClientTesting()]})
    service = TestBed.inject(PurchaseBulkPaymentService)
    http = TestBed.inject(HttpTestingController)
  })

  afterEach(() => http.verify())

  it('posts the search to the purchase search path and exposes the rows', () => {
    service.loadPayable(searchRequest('supplier'))

    const request = http.expectOne('/secured/purchases/bulk-payment/search')
    expect(request.request.method).toBe('POST')
    expect(request.request.body).toEqual(searchRequest('supplier'))
    request.flush([line('a'), line('b')])

    expect(purchaseIds()).toEqual(['a', 'b'])
  })

  it('replaces the previous supplier\'s rows when another supplier is loaded', () => {
    loadPayable([line('a')])

    service.loadPayable(searchRequest('second'))

    expect(purchaseIds()).toEqual([])
    http.expectOne('/secured/purchases/bulk-payment/search').flush([line('c')])
    expect(purchaseIds()).toEqual(['c'])
  })

  it('keeps the unselected rows, which the server leaves out of its answer', () => {
    loadPayable([line('a'), line('b'), line('c')])

    recordPayment([
      line('a', {paidTotal: 100, payable: 0, paymentStatus: PaymentStatus.FULLY_SETTLED, appliedAmount: 100, paymentReferenceNumber: 'PAY1'})
    ])

    expect(purchaseIds()).toEqual(['a', 'b', 'c'])
    expect(service.selectForId('a')?.paymentStatus).toBe(PaymentStatus.FULLY_SETTLED)
    expect(service.selectForId('a')?.paymentReferenceNumber).toBe('PAY1')
    expect(service.selectForId('b')?.payable).toBe(100)
  })

  

  

  it('clears the applied amount of rows from an earlier save that this save did not touch', () => {
    loadPayable([
      line('a', {appliedAmount: 40, supplierPaymentId: 'p1', paymentReferenceNumber: 'PAY0'}),
      line('b')
    ])

    recordPayment([line('b', {appliedAmount: 10})])

    expect(service.selectForId('a')?.appliedAmount).toBe(0)
    expect(service.selectForId('a')?.supplierPaymentId).toBeUndefined()
    expect(service.selectForId('a')?.paymentReferenceNumber).toBeUndefined()
    expect(service.selectForId('b')?.appliedAmount).toBe(10)
  })

  it('drops the payment reference a selected row had when the save leaves it unpaid', () => {
    loadPayable([line('a', {appliedAmount: 40, paymentReferenceNumber: 'PAY0'})])

    recordPayment([line('a')])

    expect(service.selectForId('a')?.paymentReferenceNumber).toBeUndefined()
  })
})
