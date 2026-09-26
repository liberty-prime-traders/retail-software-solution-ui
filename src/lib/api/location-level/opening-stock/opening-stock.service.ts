import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {OpeningStockLine} from './opening-stock.model'
import {OpeningStockStore} from './opening-stock.store'

@Injectable({providedIn: 'root'})
export class OpeningStockService extends BaseService<OpeningStockLine> {

  constructor(protected override readonly store: OpeningStockStore) {
    super(store)
  }

  declareInitialStock(lines: Partial<OpeningStockLine>[], callbacks?: ApiCallbacks<OpeningStockLine>) {
    this.patchApiRequestConfig({upsertOnSuccess: true})
    return this.postRequest({body: lines, callbacks})
  }
}
