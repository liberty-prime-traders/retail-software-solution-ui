import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {Product} from './product.model'
import {ProductSearchStore} from '../product-search/product-search.store'


@Injectable({providedIn: 'root'})
export class ProductService extends BaseService<Product> {

  private readonly basePath = '/secured/products'

  constructor(protected override readonly store: ProductSearchStore) {
    super(store)
  }

  protected override getBasePath(id?: EntityId): string {
    const idPath = id ? `/${id}` : ''
    const urlSuffix = this.apiRequestConfig().urlSuffix
    const suffixPath = urlSuffix ? `/${urlSuffix}` : ''
    return `${this.basePath}${idPath}${suffixPath}`
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
