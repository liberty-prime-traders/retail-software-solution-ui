import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ProductSalesLine} from './product-sales-line.model'

@Injectable({providedIn: 'root'})
export class ProductSalesLinesStore extends createBaseStore<ProductSalesLine>() implements BaseStore<ProductSalesLine> {
  readonly basePath = 'sales/product-report'
}
