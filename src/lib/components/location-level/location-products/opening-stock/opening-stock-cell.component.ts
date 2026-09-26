import {Component, computed, inject, input} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {LocationProduct} from '../../../../api/location-level/location-product/location-product.model'
import {
  AlternativeUnitsFinderPipe
} from '../../../../api/organization-level/unit-conversion/pipes/alternative-units-finder.pipe'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {OpeningStockDeclarationService} from './opening-stock-declaration.service'

@Component({
  selector: 'rts-opening-stock-cell',
  templateUrl: 'opening-stock-cell.component.html',
  imports: [
    FormsModule,
    InputNumber,
    Select,
    AlternativeUnitsFinderPipe,
    NullishToZeroPipe
  ]
})
export class OpeningStockCellComponent {
  private readonly declarationService = inject(OpeningStockDeclarationService)

  readonly product = input.required<LocationProduct>()
  readonly editMode = input(false)
  readonly draft = computed(() => this.declarationService.draftFor(this.product()))

  readonly displayQuantity = computed(() =>
    this.product().openingStockQuantity ?? this.declarationService.declaredQuantityFor(this.product())
  )

  readonly showEditor = computed(() =>
    this.editMode() && !this.product().openingStockQuantity && !this.declarationService.isDeclared(this.product())
  )
  updateQuantity(quantity: number) {
    this.declarationService.updateDraft(this.product(), {quantity})
  }

  updateUnitId(unitId: string) {
    this.declarationService.updateDraft(this.product(), {unitId})
  }

  updateUnitCost(unitCost: number) {
    this.declarationService.updateDraft(this.product(), {unitCost})
  }
}
