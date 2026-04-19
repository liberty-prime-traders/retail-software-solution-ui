import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {BaseProduct} from './base-product.model'
import {ProductSearchParameters} from './product-search-parameters.model'


export abstract class ProductService<PRODUCT extends BaseProduct> extends BaseService<PRODUCT> {

  protected constructor(protected override readonly store: PaginatedBaseStore<PRODUCT, ProductSearchParameters>) {
    super(store)
  }

  deactivateProduct(productId: string, callbacks?: ApiCallbacks<PRODUCT>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'deactivate'})
    return this.putRequest({callbacks, id: productId})
  }

  reactivateProduct(productId: string, callbacks?: ApiCallbacks<PRODUCT>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'reactivate'})
    return this.putRequest({callbacks, id: productId})
  }
}
