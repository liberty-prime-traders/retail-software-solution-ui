import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject, input, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {PurchaseDeliveryLine} from '../../../../api/location-level/delivery/purchase-delivery.model'
import {
  DeliveryLineRevisionPreview
} from '../../../../api/location-level/delivery-revision/delivery-line-revision-preview.model'
import {DeliveryLineRevisionService} from '../../../../api/location-level/delivery-revision/delivery-line-revision.service'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {
  DeliveryLineRevisionPreviewService
} from '../../../../api/location-level/delivery-revision/delivery-line-revision-preview.service'
import {
  UnitDescriptionPipe
} from '../../../../api/organization-level/unit-conversion/pipes/unit-description.pipe'
import {
  AlternativeUnitsFinderPipe
} from '../../../../api/organization-level/unit-conversion/pipes/alternative-units-finder.pipe'
import {ProductLabelPipe} from '../../../../utils/pipes/product-label.pipe'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {PurchaseFormContext} from '../../purchases/purchase-form/form-utils/purchase-form-context'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {DeliveryLineRevisionFormDefinition} from './delivery-line-revision-form.definition'
import {RevisionPreviewDialogComponent} from './revision-preview-dialog.component'

@Component({
  selector: 'rts-delivery-line-revision-form',
  templateUrl: 'delivery-line-revision-form.component.html',
  imports: [
    ButtonDirective,
    CurrencyPipe,
    ErrorSummaryComponent,
    FormField,
    FormFieldComponent,
    InputNumber,
    InputText,
    LoadingContainerComponent,
    Select,
    ProductLabelPipe,
    RevisionPreviewDialogComponent,
    UnitDescriptionPipe,
    AlternativeUnitsFinderPipe
  ]
})
export class DeliveryLineRevisionFormComponent extends BaseFormComponent<DeliveryLineRevisionPreviewService> {

  protected readonly apiService = inject(DeliveryLineRevisionPreviewService)
  private readonly deliveryLineRevisionService = inject(DeliveryLineRevisionService)
  private readonly purchaseService = inject(PurchaseService)
  private readonly purchaseFormContext = inject(PurchaseFormContext)

  readonly deliveryLine = input.required<PurchaseDeliveryLine>()
  readonly cancelled = output()
  readonly revised = output()

  readonly FormFieldDirection = FormFieldLayout
  readonly DeliveryLineRevisionFormDefinition = DeliveryLineRevisionFormDefinition

  readonly deliveryLineRevisionFormValue =
    signal<DeliveryLineRevisionFormDefinition.DeliveryLineRevisionFormModel>(
      {userProvidedQuantityDelivered: null, unitId: '', unitCost: null, reason: ''}
    )

  readonly deliveryLineRevisionForm = form(
    this.deliveryLineRevisionFormValue,
    DeliveryLineRevisionFormDefinition.deliveryLineRevisionFormSchema
  )

  readonly isLoading = computed(() => this.apiService.selectLoading() || this.isSaving())
  readonly isSaving = this.deliveryLineRevisionService.selectLoading
  readonly saveFailureMessages = computed(() => this.deliveryLineRevisionService.selectFailureMessages())
  readonly preview = signal<DeliveryLineRevisionPreview | undefined>(undefined)
  readonly previewVisible = signal(false)

  readonly canPreview = computed(() => this.deliveryLineRevisionForm().valid() && !this.isLoading())

  override ngOnInit() {
    super.ngOnInit()
    this.deliveryLineRevisionService.resetProcessingStatus()
    this.deliveryLineRevisionFormValue.set(DeliveryLineRevisionFormDefinition.createDefault(this.deliveryLine()))
  }

  clearQuantityAndCost() {
    this.deliveryLineRevisionFormValue.update(formValue => ({
      ...formValue, userProvidedQuantityDelivered: null, unitCost: null
    }))
  }

  cancel() {
    this.cancelled.emit()
  }

  previewRevision() {
    const deliveryLineRevisionRequest = DeliveryLineRevisionFormDefinition.toRequest(
      this.deliveryLine(), this.deliveryLineRevisionFormValue()
    )
    this.apiService.preview(deliveryLineRevisionRequest, {
      onSuccess: (deliveryLineRevisionPreview) => {
        this.preview.set(deliveryLineRevisionPreview)
        this.previewVisible.set(true)
      }
    })
  }

  saveRevision() {
    const deliveryLineRevisionRequest = DeliveryLineRevisionFormDefinition.toRequest(
      this.deliveryLine(), this.deliveryLineRevisionFormValue()
    )
    this.deliveryLineRevisionService.revise(deliveryLineRevisionRequest, {
      onSuccess: (updatedPurchase) => {
        this.purchaseService.applyResponse(updatedPurchase)
        this.purchaseFormContext.initializeForm(updatedPurchase)
        this.previewVisible.set(false)
        this.revised.emit()
      },
      onFail: () => this.previewVisible.set(false)
    })
  }
}
