import {Injectable} from '@angular/core'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {StockHistory} from './stock-history.model'
import {StockHistoryStore} from './stock-history.store'

@Injectable({providedIn: 'root'})
export class StockHistoryService extends MultimapBaseService<StockHistory> {

  protected override keyPath: keyof StockHistory = 'locationProductId'

  constructor(protected override readonly store: StockHistoryStore) {
    super(store)
  }
}
