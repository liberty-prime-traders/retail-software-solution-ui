import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {form} from '@angular/forms/signals'
import {isEqual} from 'lodash-es'
import {
  PurchaseBulkPaymentCreateRequest,
  PurchaseBulkPaymentSearchRequest
} from '../../../api/location-level/purchase-bulk-payment/purchase-bulk-payment.model'
import {
  PurchaseBulkPaymentService
} from '../../../api/location-level/purchase-bulk-payment/purchase-bulk-payment.service'
import {ZonedDatesService} from '../../../utils/services/zoned-dates.service'
import {sumPayable} from './bulk-payment-allocation.util'
import {BulkPaymentFormDefinition} from './bulk-payment-form.definition'

@Injectable()
export class BulkPaymentFormContext {
  private readonly zonedDatesService = inject(ZonedDatesService)
  private readonly purchaseBulkPaymentService = inject(PurchaseBulkPaymentService)

  private readonly formValue = signal<BulkPaymentFormDefinition.BulkPaymentFormModel>(
    BulkPaymentFormDefinition.createDefaultBulkPaymentFormModel()
  )
  readonly bulkPaymentForm = form(this.formValue, BulkPaymentFormDefinition.bulkPaymentFormSchema)

  readonly purchases = this.purchaseBulkPaymentService.selectAll
  readonly amount = computed(() => this.formValue().amount)
  readonly selectedPurchaseIds = signal<ReadonlySet<string>>(new Set())
  readonly paymentRecorded = signal(false)

  readonly selectedCount = computed(() => this.selectedPurchaseIds().size)
  readonly selectedPayable = computed(() => sumPayable(this.purchases(), this.selectedPurchaseIds()))
  readonly amountExceedsSelectedPayable = computed(() => (this.amount() ?? 0) > this.selectedPayable())
  readonly disableSave = computed(() =>
    this.bulkPaymentForm().invalid() || this.selectedCount() === 0 || this.amountExceedsSelectedPayable()
  )

  readonly rangeTooWide = computed(() => {
    const {orderedFrom, orderedTo} = this.formValue()
    return !!orderedFrom && !!orderedTo && !BulkPaymentFormDefinition.hasSearchableRange(this.formValue())
  })

  private readonly searchRequest = computed(
    () => BulkPaymentFormDefinition.hasSearchableRange(this.formValue())
      ? BulkPaymentFormDefinition.convertToSearchRequest(this.formValue(), this.zonedDatesService)
      : null,
    {equal: isEqual}
  )

  private readonly reloadOnSearchChange = effect(() => {
    const searchRequest = this.searchRequest()
    untracked(() => this.reloadPayablePurchases(searchRequest))
  })

  toggleSelection(purchaseId: string) {
    this.selectedPurchaseIds.update(selected => {
      const updated = new Set(selected)
      if (!updated.delete(purchaseId)) {
        updated.add(purchaseId)
      }
      return updated
    })
  }

  replaceSelection(purchaseIds: Iterable<string>) {
    this.selectedPurchaseIds.set(new Set(purchaseIds))
  }

  getCreateRequest(): PurchaseBulkPaymentCreateRequest {
    return BulkPaymentFormDefinition.convertToCreateRequest(
      this.formValue(), [...this.selectedPurchaseIds()], this.zonedDatesService
    )
  }

  markPaymentRecorded() {
    this.selectedPurchaseIds.set(new Set())
    this.paymentRecorded.set(true)
    this.formValue.update(current => ({...current, amount: null, notes: ''}))
  }

  startNewPayment() {
    this.reloadPayablePurchases(this.searchRequest())
  }

  private reloadPayablePurchases(searchRequest: PurchaseBulkPaymentSearchRequest | null) {
    this.selectedPurchaseIds.set(new Set())
    this.paymentRecorded.set(false)
    if (searchRequest?.supplierId) {
      this.purchaseBulkPaymentService.loadPayable(searchRequest)
    } else {
      this.purchaseBulkPaymentService.resetStoreAndClearCache()
    }
  }
}
