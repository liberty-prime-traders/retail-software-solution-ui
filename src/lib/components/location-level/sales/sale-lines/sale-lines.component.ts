import {Component, computed, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Badge} from 'primeng/badge'
import {TableModule} from 'primeng/table'
import {ProductWithAvailability} from '../../../../api/location-level/product-lookup/product-with-availability.model'
import {
  UnitConversionGraphService
} from '../../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {
  AvailableProductLookupComponent
} from '../../location-product-lookup/available-product-lookup/available-product-lookup.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {EditableSaleLinesComponent} from './editable-sale-lines/editable-sale-lines.component'
import {ReadOnlySaleLinesComponent} from './read-only-sale-lines/read-only-sale-lines.component'

@Component({
  selector: 'rts-sale-lines',
  templateUrl: 'sale-lines.component.html',
  styleUrl: 'sale-lines.component.scss',
  imports: [
    TableModule,
    FormsModule,
    AvailableProductLookupComponent,
    Badge,
    EditableSaleLinesComponent,
    ReadOnlySaleLinesComponent,
    LoadingContainerComponent
  ]
})
export class SaleLinesComponent {
  private readonly context = inject(SaleFormContext)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  readonly saleSession = this.context.saleSession
  readonly unitConversionGraphIsLoading = this.unitConversionGraphService.isLoading

  readonly canAddOrEditProducts = computed(() =>
    this.saleSession().uiOptions.canMakeChangesToTheSale
  )

  readonly saleLines = computed(() =>
    this.unitConversionGraphIsLoading() ? [] : this.context.saleLines()
  )

  readonly selectedProductIds = computed(() =>
    this.saleLines().map(l => l.locationProductId)
  )

  sendLineRequest(newProduct?: ProductWithAvailability) {
    this.context.sendLineRequest(newProduct)
  }

}
