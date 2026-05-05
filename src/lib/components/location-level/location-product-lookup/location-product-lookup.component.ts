import {Component, computed, effect, inject, input, OnInit, output, untracked} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Select} from 'primeng/select'
import {
  LocationProductQuickSearchService
} from '../../../api/location-level/location-product/location-product-quick-search.service'
import {LocationProduct} from '../../../api/location-level/location-product/location-product.model'
import {LocationProductStore} from '../../../api/location-level/location-product/location-product.store'
import {UnitConversionGraphService} from '../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {PaginatedBaseService} from '../../../api/util/paginated-api/paginated-base.service'
import {ProductLabelPipe} from '../../../utils/pipes/product-label.pipe'
import {toSelectItems} from '../../../utils/types/select-item.type'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {HasFilteredDataComponent} from '../../reusable/has-filtered-data.component'
import {LocationProductFilterService} from '../location-products/location-product-filter.service'

@Component({
  selector: 'rts-product-lookup',
  templateUrl: 'location-product-lookup.component.html',
  providers: [
    LocationProductQuickSearchService,
    LocationProductStore,
    {provide: PaginatedBaseService, useExisting: LocationProductQuickSearchService},
    LocationProductFilterService
  ],
  imports: [
    FormFieldComponent,
    Select
  ]
})
export class LocationProductLookupComponent extends HasFilteredDataComponent implements OnInit {

  readonly selectedProductIds = input<string[]>([])
  readonly productSelected = output<LocationProduct>()

  private readonly productQuickSearchService = inject(LocationProductQuickSearchService)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)
  private readonly productFilterService = inject(LocationProductFilterService)
  protected override readonly applyFilters$ = this.productFilterService.applyFilters$

  private readonly searchValueFormControl = this.productFilterService.filterForm.get('searchText')

  pushToSearch(searchText: string) {
    this.searchValueFormControl?.setValue(searchText)
  }

  readonly productsMap = computed(() => {
    const map = new Map<EntityId, LocationProduct>()
    this.productFilterService.filteredProducts().forEach(product => map.set(product.id, product))
    return map
  })

  readonly productOptions = computed(() => {
    return toSelectItems(this.productFilterService.filteredProducts(), {
      itemValueBy: this.extractValueFromProduct,
      itemLabelBy: this.extractLabelFromProduct
    })
  })

  readonly dependenciesLoading = computed(() =>
    this.productQuickSearchService.selectLoading() || this.unitConversionGraphService.isLoading()
  )

  private readonly pushSelectedProductsToDeferred = effect(() => {
    const selectedProducts = this.selectedProductIds()
    untracked(() => {
      if (selectedProducts.length) {
        this.productFilterService.resetExternalParameters({excludeIds: selectedProducts})
      }
    })
  })

  override ngOnInit() {
    super.ngOnInit()
    this.productQuickSearchService.fetchProducts('', this.selectedProductIds())
  }

  private readonly extractLabelFromProduct = (product: LocationProduct): string => {
    return ProductLabelPipe.prototype.transform(product)
  }

  private readonly extractValueFromProduct = (product: LocationProduct): EntityId => {
    return product.id as EntityId
  }

  emitSelectedProduct(locationProductId: EntityId) {
    const selectedProduct = this.productsMap().get(locationProductId)
    if (selectedProduct) {
      this.productSelected.emit(selectedProduct)
    }
  }

}
