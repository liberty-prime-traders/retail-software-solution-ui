import {computed, Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ProductLabelPipe} from '../../../utils/pipes/product-label.pipe'
import {toSelectItems} from '../../../utils/types/select-item.type'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {ProductStatus} from '../../cross-tier/product/product-status.enum'
import {BaseService} from '../../util/base-api/base.service'
import {PageRequest} from '../../util/paginated-api/page-request.model'
import {LocationProduct} from './location-product.model'
import {LocationProductStore} from './location-product.store'

@Injectable()
export class LocationProductQuickSearchService extends BaseService<LocationProduct, PageRequest<ProductSearchParameters>> {
  private static readonly PAGE_SIZE = 10

  readonly productsMap = computed(() => {
    const map = new Map<EntityId, LocationProduct>()
    this.selectAll().forEach(product => map.set(product.id, product))
    return map
  })

  readonly productOptions = computed(() => {
    return toSelectItems(this.selectAll(), {
      itemValueBy: this.extractValueFromProduct,
      itemLabelBy: this.extractLabelFromProduct
    })
  })

  constructor(protected override readonly store: LocationProductStore) {
    super(store)
  }

  fetchProducts(searchText: string) {
    this.patchApiRequestConfig({urlSuffix: 'search'})
    const searchParameters: ProductSearchParameters = {searchText, statusList: [ProductStatus.ACTIVE]}
    const pageRequest: PageRequest<ProductSearchParameters> = {
      previousCursor: '',
      requestedSize: LocationProductQuickSearchService.PAGE_SIZE,
      parameters: searchParameters
    }
    return this.post(pageRequest)
  }

  private readonly extractLabelFromProduct = (product: LocationProduct): string => {
    return ProductLabelPipe.prototype.transform(product)
  }

  private readonly extractValueFromProduct = (product: LocationProduct): EntityId => {
    return product.id as EntityId
  }

}
