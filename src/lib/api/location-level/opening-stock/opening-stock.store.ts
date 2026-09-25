import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {OpeningStockLine} from './opening-stock.model'

@Injectable({providedIn: 'root'})
export class OpeningStockStore extends createBaseStore<OpeningStockLine>((entity) => entity.referenceNumber!)
  implements BaseStore<OpeningStockLine> {
  readonly basePath = 'opening-stock'
}
