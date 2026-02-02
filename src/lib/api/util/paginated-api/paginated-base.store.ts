import {Signal} from '@angular/core'
import {signalStore} from '@ngrx/signals'
import {withBaseStore} from '../base-api/base-store.feature'
import {BaseModel} from '../base-api/base.model'
import {BaseStore} from '../base-api/base.store'
import {CURSOR} from './page-request.model'
import {withPaginatedBaseStore} from './paginated-store.feature'
import {PaginatedState} from './paginated.state'

export interface PaginatedBaseStore<ENTITY extends BaseModel, PARAMETERS> extends BaseStore<ENTITY> {
  currentCursor: Signal<CURSOR>
  hasMore: Signal<boolean>
  requireClientSideFilter: Signal<boolean>
  lastSearchParams: Signal<PARAMETERS>
  setPaginationState(paginatedState: PaginatedState<PARAMETERS>): void
  resetPagination(): void
}

export function createPaginatedBaseStore<ENTITY extends BaseModel, PARAMETERS>() {
  return signalStore(
    withBaseStore<ENTITY>(entity => entity.id),
    withPaginatedBaseStore<PARAMETERS>()
  )
}
