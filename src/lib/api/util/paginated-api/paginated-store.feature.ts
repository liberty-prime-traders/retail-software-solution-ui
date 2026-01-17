import {patchState, signalStoreFeature, withMethods, withState} from '@ngrx/signals'
import {createDefaultPaginatedState, PaginatedState} from './paginated.state'


export const withPaginatedBaseStore = <PARAMETERS>() => signalStoreFeature(
  withState<PaginatedState<PARAMETERS>>(createDefaultPaginatedState<PARAMETERS>()),
  withMethods((store) => ({
    setPaginationState(paginatedState: PaginatedState<PARAMETERS>): void {
      patchState(store, {
        lastSearchParams: paginatedState.lastSearchParams,
        currentCursor: paginatedState.currentCursor,
        hasMore: paginatedState.hasMore
      })
    },
    resetPagination() {
      patchState(store, createDefaultPaginatedState())
    }
  }))
)

