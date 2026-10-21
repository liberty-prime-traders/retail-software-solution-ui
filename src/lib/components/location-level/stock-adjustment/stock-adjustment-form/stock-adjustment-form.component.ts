import {Component, computed, effect, inject, OnInit, output, signal, untracked} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {ProductForPurchase} from '../../../../api/location-level/product-lookup/product-for-purchase.model'
import {
  StockAdjustmentCategoryDescriptorService
} from '../../../../api/location-level/stock-adjustment/stock-adjustment-category-descriptor.service'
import {StockAdjustmentService} from '../../../../api/location-level/stock-adjustment/stock-adjustment.service'
import {
  AlternativeUnitsFinderPipe
} from '../../../../api/organization-level/unit-conversion/pipes/alternative-units-finder.pipe'
import {ProductLabelPipe} from '../../../../utils/pipes/product-label.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {toSelectItems} from '../../../../utils/types/select-item.type'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {
  PurchaseProductLookupComponent
} from '../../location-product-lookup/purchase-product-lookup/purchase-product-lookup.component'
import {StockAdjustmentFormDefinition} from './stock-adjustment-form.definition'

@Component({
  selector: 'rts-location-stock-adjustment-form',
  templateUrl: 'stock-adjustment-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    FormField,
    InputNumber,
    InputText,
    Select,
    AlternativeUnitsFinderPipe,
    PurchaseProductLookupComponent,
    LoadingContainerComponent
  ]
})
export class StockAdjustmentFormComponent extends BaseFormComponent<StockAdjustmentService> implements OnInit {

  private readonly stockAdjustmentService = inject(StockAdjustmentService)
  private readonly categoryDescriptorService = inject(StockAdjustmentCategoryDescriptorService)
  protected override apiService: StockAdjustmentService = this.stockAdjustmentService

  readonly stockAdjustmentSaved = output<void>()

  readonly stockAdjustmentFormValue = signal<StockAdjustmentFormDefinition.StockAdjustmentFormModel>(
    StockAdjustmentFormDefinition.defaultStockAdjustmentFormModel
  )

  readonly stockAdjustmentForm = form(
    this.stockAdjustmentFormValue,
    StockAdjustmentFormDefinition.stockAdjustmentFormSchema
  )
  readonly stockAdjustmentFormFields = StockAdjustmentFormDefinition.fieldMap

  readonly categoryDescriptors = this.categoryDescriptorService.selectAll
  readonly categoriesLoading = this.categoryDescriptorService.selectLoading

  private readonly selectedDescriptor = computed(() =>
    this.categoryDescriptors().find(descriptor => descriptor.category === this.stockAdjustmentFormValue().category)
  )

  readonly directionOptions = computed(() =>
    toSelectItems(this.selectedDescriptor()?.allowedDirections ?? [], {
      itemValueBy: direction => direction,
      itemLabelBy: direction => PrettifyEnumPipe.prototype.transform(direction)
    })
  )

  readonly requiresUnitCost = computed(() => StockAdjustmentFormDefinition.requiresUnitCost(
    this.stockAdjustmentFormValue().unitCostDirections,
    this.stockAdjustmentFormValue().direction
  ))

  readonly directionIsChosenByUser = computed(() => this.directionOptions().length > 1)

  readonly reasonOptions = computed(() => {
    const direction = this.stockAdjustmentFormValue().direction
    return (this.selectedDescriptor()?.reasons ?? [])
      .filter(reason => direction !== '' && reason.allowedDirections.includes(direction))
  })

  private readonly applyCategoryDescriptor = effect(() => {
    const descriptor = this.selectedDescriptor()
    if (!descriptor) return
    untracked(() => this.stockAdjustmentFormValue.update(formValue => ({
      ...formValue,
      unitCostDirections: descriptor.unitCostDirections,
      requiresReason: descriptor.requiresReason,
      requiresNote: descriptor.requiresNote,
      direction: descriptor.allowedDirections.length === 1 ? descriptor.allowedDirections[0] : '',
      stockMovementReasonId: ''
    })))
  })

  override ngOnInit() {
    super.ngOnInit()
    this.categoryDescriptorService.fetch()
  }

  selectProduct(product: ProductForPurchase) {
    this.stockAdjustmentFormValue.update(formValue => ({
      ...formValue,
      locationProductId: product.id as string,
      productLabel: ProductLabelPipe.prototype.transform(product),
      baseUnitId: product.baseUnitId,
      unitId: product.baseUnitId
    }))
  }

  resetForm() {
    this.stockAdjustmentFormValue.set(StockAdjustmentFormDefinition.defaultStockAdjustmentFormModel)
  }

  saveStockAdjustment() {
    this.stockAdjustmentService.post(
      StockAdjustmentFormDefinition.convertToBackendModel(this.stockAdjustmentFormValue()),
      {onSuccess: () => this.stockAdjustmentSaved.emit()}
    )
  }
}
