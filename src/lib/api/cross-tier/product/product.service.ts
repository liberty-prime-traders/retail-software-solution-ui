import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {BaseProduct} from './base-product.model'
import {ProductSearchParameters} from './product-search-parameters.model'


export abstract class ProductService<PRODUCT extends BaseProduct> extends BaseService<PRODUCT> {

  protected constructor(protected override readonly store: PaginatedBaseStore<PRODUCT, ProductSearchParameters>) {
    super(store)
  }

  deactivateProduct(productId: string): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'deactivate'})
    return this.putWithId(productId)
  }

  reactivateProduct(productId: string): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'reactivate'})
    return this.putWithId(productId)
  }
}
