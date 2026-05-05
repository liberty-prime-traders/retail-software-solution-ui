import {Component, computed, inject, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField, required} from '@angular/forms/signals'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {TableModule} from 'primeng/table'
import {PurchaseDeliveryService} from '../../../../../../api/location-level/delivery/purchase-delivery.service'
import {PurchaseService} from '../../../../../../api/location-level/purchase/purchase.service'
import {
  AlternativeUnitsFinderPipe
} from '../../../../../../api/organization-level/unit-conversion/pipes/alternative-units-finder.pipe'
import {
  FullUnitDescriptionPipe
} from '../../../../../../api/organization-level/unit-conversion/pipes/full-unit-description.pipe'
import {
  ConversionContextPipe,
  UnitConversionDescriptorPipe,
  UnitConvertPipe,
  UnitCurrencyPipe,
  UnitFactorResolver
} from '../../../../../../api/organization-level/unit-conversion/pipes/unit-convert.pipe'
import {ProductLabelPipe} from '../../../../../../utils/pipes/product-label.pipe'
import {ZonedDatesService} from '../../../../../../utils/services/zoned-dates.service'
import {BaseFormComponent} from '../../../../../reusable/base-form.component'
import {FormFieldLayout} from '../../../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../../../reusable/loading-container/loading-container.component'
import {PurchaseDeliveryFormDefinition} from '../../form-utils/purchase-delivery-form.definition'
import {PurchaseFormContext} from '../../form-utils/purchase-form-context'

@Component({
  selector: 'rts-purchase-delivery-form',
  templateUrl: 'delivery-form.component.html',
  imports: [
    TableModule,
    Button,
    FormFieldComponent,
    DatePicker,
    FormField,
    InputText,
    FormsModule,
    InputNumber,
    LoadingContainerComponent,
    ProductLabelPipe,
    AlternativeUnitsFinderPipe,
    Select,
    FullUnitDescriptionPipe,
    UnitConvertPipe,
    ConversionContextPipe,
    UnitCurrencyPipe,
    UnitConversionDescriptorPipe,
    UnitFactorResolver
  ]
})
export class DeliveryFormComponent extends BaseFormComponent<PurchaseDeliveryService> {

  private readonly purchaseFormContext = inject(PurchaseFormContext)
  private readonly deliveryService = inject(PurchaseDeliveryService)
  private readonly purchaseService = inject(PurchaseService)
  protected readonly apiService = this.deliveryService
  private readonly zonedDatesService = inject(ZonedDatesService)

  readonly cancelled = output()
  readonly deliverySaved = output()

  readonly FormFieldDirection = FormFieldLayout

  private readonly deliveryFormValue = signal<PurchaseDeliveryFormDefinition.DeliveryFormModel>(
    PurchaseDeliveryFormDefinition.createDefault(
      this.purchaseFormContext.purchaseLinesArray().filter(line => line.quantityExpected > 0)
    )
  )

  readonly deliveryForm = form(this.deliveryFormValue, s => {
    required(s.deliveredAt)
  })

  readonly deliveryLinesArray = computed(() => this.deliveryForm.lines().value())
  readonly isLoading = this.deliveryService.selectLoading

  cancel() {
    this.cancelled.emit()
  }

  save() {
    const purchaseId = this.purchaseFormContext.purchaseId() ?? ''
    const dto = PurchaseDeliveryFormDefinition.toBackendModel(
      purchaseId, this.deliveryFormValue(), this.zonedDatesService
    )
    this.deliveryService.post(dto, {
      onSuccess: (updatedPurchase) => {
        this.purchaseService.applyResponse(updatedPurchase)
        this.purchaseFormContext.initializeForm(updatedPurchase)
        this.deliverySaved.emit()
      }
    })
  }

  clearQuantities(purchaseLineId: string, unitId: string) {
    const lines = this.deliveryFormValue().lines
    const updatedLines = lines.map(line => {
      if (line.purchaseLineId === purchaseLineId) {
        return {...line, unitId, quantityDelivered: 0, unitCost: 0}
      }
      return line
    })
    this.deliveryFormValue.update(form => ({...form, lines: updatedLines}))
  }
}
