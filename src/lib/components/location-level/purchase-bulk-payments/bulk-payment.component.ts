import {CurrencyPipe, DatePipe, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, OnInit} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Card} from 'primeng/card'
import {Checkbox} from 'primeng/checkbox'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {PaymentStatusSeverityPipe} from '../../../api/cross-tier/payment-status-severity.pipe'
import {
  PurchaseBulkPaymentService
} from '../../../api/location-level/purchase-bulk-payment/purchase-bulk-payment.service'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {PaymentOptionService} from '../../../api/organization-level/payment-option/payment-option.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'
import {PurchaseStatusSeverityPipe} from '../purchases/purchase-status-severity.pipe'
import {buildBulkPaymentRows, sumAmounts} from './bulk-payment-allocation.util'
import {BulkPaymentFilterComponent} from './bulk-payment-filter.component'
import {BulkPaymentFormContext} from './bulk-payment-form-context'
import {BulkPaymentPaymentFormComponent} from './bulk-payment-payment-form.component'

@Component({
  selector: 'rts-bulk-payment',
  templateUrl: 'bulk-payment.component.html',
  providers: [BulkPaymentFormContext],
  imports: [
    Card,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    Checkbox,
    TableModule,
    Tag,
    PaymentStatusSeverityPipe,
    PurchaseStatusSeverityPipe,
    NullSafePipe,
    PrettifyEnumPipe,
    EmptyRowComponent,
    LoadingContainerComponent,
    BulkPaymentFilterComponent,
    BulkPaymentPaymentFormComponent,
    Divider,
    AutoStretchDirective,
    NgTemplateOutlet
  ]
})
export class BulkPaymentComponent implements OnInit {
  private readonly bulkPaymentFormContext = inject(BulkPaymentFormContext)
  private readonly purchaseBulkPaymentService = inject(PurchaseBulkPaymentService)
  private readonly contactService = inject(ContactService)
  private readonly paymentOptionService = inject(PaymentOptionService)

  readonly loading = computed(() =>
    this.purchaseBulkPaymentService.selectLoading()
      || this.contactService.selectLoading()
      || this.paymentOptionService.selectLoading()
  )

  readonly paymentRecorded = this.bulkPaymentFormContext.paymentRecorded
  readonly selectedCount = this.bulkPaymentFormContext.selectedCount
  readonly selectedPayable = this.bulkPaymentFormContext.selectedPayable

  private readonly purchases = this.bulkPaymentFormContext.purchases
  readonly maximumLoadedPurchases = PurchaseBulkPaymentService.MAXIMUM_LOADED_PURCHASES
  readonly mayHaveMore = computed(() => this.purchases().length >= this.maximumLoadedPurchases)
  readonly totalPayable = computed(() => sumAmounts(this.purchases().map(purchase => purchase.payable)))
  readonly totalApplied = computed(() => sumAmounts(this.purchases().map(purchase => purchase.appliedAmount)))

  readonly rows = computed(() =>
    buildBulkPaymentRows(
      this.purchases(),
      this.bulkPaymentFormContext.selectedPurchaseIds(),
      this.bulkPaymentFormContext.amount()
    )
  )
  readonly selectableRowCount = computed(() => this.rows().filter(row => row.selectable).length)
  readonly allSelected = computed(() =>
    this.selectableRowCount() > 0 && this.selectedCount() === this.selectableRowCount()
  )

  ngOnInit() {
    this.purchaseBulkPaymentService.resetProcessingStatus()
    this.contactService.fetch()
    this.paymentOptionService.fetch()
  }

  toggleSelection(purchaseId: string) {
    this.bulkPaymentFormContext.toggleSelection(purchaseId)
  }

  toggleAllSelection() {
    this.bulkPaymentFormContext.replaceSelection(
      this.allSelected() ? [] : this.rows().filter(row => row.selectable).map(row => row.line.id)
    )
  }
}
