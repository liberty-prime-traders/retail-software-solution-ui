import {Component, computed, inject, OnInit} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {Card} from 'primeng/card'
import {Select} from 'primeng/select'
import {ToggleButton} from 'primeng/togglebutton'
import {SaleStatus} from '../../../../api/location-level/sale/sale-status.enum'
import {Sale} from '../../../../api/location-level/sale/sale.model'
import {SaleService} from '../../../../api/location-level/sale/sale.service'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormHeaderComponent} from '../sale-form-header/sale-form-header.component'
import {SaleLinesComponent} from '../sale-lines/sale-lines.component'
import {SaleSummaryComponent} from '../sale-summary/sale-summary.component'

@Component({
  selector: 'rts-new-sale',
  templateUrl: 'sale-form.component.html',
  styleUrl: 'sale-form.component.scss',
  imports: [
    Card,
    FormField,
    FormFieldComponent,
    Select,
    ToggleButton,
    SaleSummaryComponent,
    SaleLinesComponent,
    LoadingContainerComponent,
    FormButtonsComponent,
    AutoStretchDirective,
    NullSafePipe,
    SaleFormHeaderComponent
  ]
})
export class SaleFormComponent extends HasSubscriptionComponent implements OnInit {

  private readonly contactService = inject(ContactService)
  private readonly context = inject(SaleFormContext)
  private readonly saleService = inject(SaleService)

  private static readonly WalkInCustomerId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  readonly saleIsLoading = this.saleService.selectLoading
  readonly customers = this.contactService.customers
  readonly saleForm = this.context.saleForm
  readonly originalSaleRecord = this.context.originalSale
  readonly saleStatus = computed(() => this.originalSaleRecord()?.status)

  readonly canEditCustomer = computed(() =>
    !this.originalSaleRecord() || this.originalSaleRecord()?.status === SaleStatus.DRAFT
  )

  readonly canVoidSale = computed(() =>
    this.saleStatus() && [SaleStatus.DRAFT, SaleStatus.CONFIRMED].includes(this.saleStatus()!)
  )

  readonly voidSaleLabel = computed(() =>
    this.saleStatus() === SaleStatus.DRAFT ? 'Discard Draft' : 'Void Sale'
  )

  ngOnInit() {
    this.contactService.fetch()
  }

  voidSale() {
    this.saleService.voidSale(this.context.originalSale()?.id!, {onSuccess: this.onSuccessfulSave})
  }

  private readonly onSuccessfulSave = (savedSale: Sale) => {
    this.context.initializeForm(savedSale)
  }

  respondToWalkInCustomer(walkInCustomer: boolean) {
    this.saleForm.contactId().value.set(walkInCustomer ? SaleFormComponent.WalkInCustomerId : '')
  }
}
