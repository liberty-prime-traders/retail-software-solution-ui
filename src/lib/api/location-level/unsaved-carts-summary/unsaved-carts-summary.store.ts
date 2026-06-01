import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {UnsavedCartsSummary} from './unsaved-carts-summary.model'

@Injectable({providedIn: 'root'})
export class UnsavedCartsSummaryStore extends createBaseStore<UnsavedCartsSummary>()
  implements BaseStore<UnsavedCartsSummary> {
  readonly basePath = 'sale-sessions/unsaved'
}
