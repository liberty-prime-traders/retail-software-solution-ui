import {Component, computed, effect, inject, input, OnInit, output, TemplateRef, untracked} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Subscription} from 'rxjs'
import {ProductCore} from '../../../api/cross-tier/product/product-core.model'
import {ProductSearchParameters} from '../../../api/cross-tier/product/product-search-parameters.model'
import {UnitConversionGraphService} from '../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {PaginatedBaseService} from '../../../api/util/paginated-api/paginated-base.service'
import {ProductLabelPipe} from '../../../utils/pipes/product-label.pipe'
import {toSelectItems} from '../../../utils/types/select-item.type'
import {HasFilteredDataComponent} from '../../reusable/has-filtered-data.component'
import {ProductLookupFilterService} from './product-lookup-filter.service'

@Component({selector: 'rts-product-lookup', template: ''})
export abstract class LocationProductLookupComponent<LOOKUP extends ProductCore>
  extends HasFilteredDataComponent implements OnInit {

  readonly templateRef = input<TemplateRef<unknown>>()
  readonly selectedProductIds = input<string[]>([])
  readonly productSelected = output<LOOKUP>()

  protected abstract fetchProducts(searchText: string, excludeIds: string[]): Subscription | undefined

  private readonly productQuickSearchService =
    inject<PaginatedBaseService<LOOKUP, ProductSearchParameters>>(PaginatedBaseService)

  private readonly unitConversionGraphService = inject(UnitConversionGraphService)
  private readonly productFilterService = inject<ProductLookupFilterService<LOOKUP>>(ProductLookupFilterService)
  protected override readonly applyFilters$ = this.productFilterService.applyFilters$

  private readonly searchValueFormControl = this.productFilterService.filterForm.get('searchText')

  pushToSearch(searchText: string) {
    this.searchValueFormControl?.setValue(searchText)
  }

  readonly productsMap = computed(() => {
    const map = new Map<EntityId, LOOKUP>()
    this.productFilterService.filteredProducts().forEach(product => map.set(product.id, product))
    return map
  })

  readonly productOptions = computed(() =>
    toSelectItems(this.productFilterService.filteredProducts(), {
      itemValueBy: this.extractValueFromProduct,
      itemLabelBy: this.extractLabelFromProduct
    })
  )

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
    this.fetchProducts('', this.selectedProductIds())
  }

  private readonly extractLabelFromProduct = (product: LOOKUP): string => {
    return ProductLabelPipe.prototype.transform(product)
  }

  private readonly extractValueFromProduct = (product: LOOKUP): EntityId => {
    return product.id as EntityId
  }

  emitSelectedProduct(locationProductId: EntityId) {
    const selectedProduct = this.productsMap().get(locationProductId)
    if (selectedProduct) {
      this.productSelected.emit(selectedProduct)
    }
  }
}
