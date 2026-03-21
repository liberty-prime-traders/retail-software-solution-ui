import {Component, computed, inject, Input, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {isNil} from 'lodash-es'
import {InputNumber} from 'primeng/inputnumber'
import {ProductStatus} from '../../../../api/cross-tier/product/product-status.enum'
import {LocationProduct} from '../../../../api/location-level/location-product/location-product.model'
import {LocationProductService} from '../../../../api/location-level/location-product/location-product.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LocationProductFormDefinition} from './location-product-form.definition'

@Component({
  selector: 'rts-location-product-form',
  templateUrl: 'location-product-form.component.html',
  imports: [
    InputNumber,
    FormButtonsComponent,
    FormFieldComponent,
    FormField
  ]
})
export class LocationProductFormComponent extends BaseFormComponent<LocationProductService> {

  private readonly locationProductService = inject(LocationProductService)
  protected override apiService: LocationProductService = this.locationProductService

  @Input()
  set locationProduct(locationProduct: LocationProduct | null) {
    if (locationProduct) {
      this.originalLocationProduct.set(locationProduct)
      this.locationProductFormValue.set(LocationProductFormDefinition.convertToFormModel(locationProduct))
    }
  }

  readonly originalLocationProduct = signal<LocationProduct | undefined>(undefined)

  readonly locationProductFormValue = signal<LocationProductFormDefinition.LocationProductFormModel>(
    LocationProductFormDefinition.defaultLocationProductFormModel
  )
  readonly productIsInactive = computed(() =>
    !isNil(this.originalLocationProduct()) && this.originalLocationProduct()?.status !== ProductStatus.ACTIVE
  )

  readonly locationProductForm = form(
    this.locationProductFormValue, LocationProductFormDefinition.locationProductFormSchema
  )
  readonly locationProductFormFields = LocationProductFormDefinition.fieldMap

  resetForm() {
    this.locationProductFormValue.set(LocationProductFormDefinition.convertToFormModel(this.originalLocationProduct()))
  }

  updateLocationProduct() {
    const updatedLocationProduct = LocationProductFormDefinition.convertToBackendModel(this.locationProductFormValue())
    if (updatedLocationProduct.id) {
      this.locationProductService.put(updatedLocationProduct)
    }
  }

  deactivateProduct() {
    this.locationProductService.deactivateProduct(this.locationProductFormValue()?.id)
  }

  reactivateProduct() {
    this.locationProductService.reactivateProduct(this.locationProductFormValue()?.id)

  }
}
