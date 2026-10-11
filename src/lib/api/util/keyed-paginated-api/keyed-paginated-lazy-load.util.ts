import {EntityId} from '@ngrx/signals/entities'
import {PaginatedModel} from '../paginated-api/paginated.model'
import {KeyedPaginatedBaseService} from './keyed-paginated-base.service'

export const loadNextForKeyOnLazyLoad = <RESPONSE extends PaginatedModel, PARAMETERS>(
  paginatedService: KeyedPaginatedBaseService<RESPONSE, PARAMETERS>,
  key: EntityId | undefined,
  last: number | undefined
): void => {
  if (!key) {
    return
  }
  const loadedRowCount = paginatedService.getLoadedCount(key)
  const overlapThreshold = 5
  if (Math.abs(loadedRowCount - (last ?? 0)) <= overlapThreshold) {
    paginatedService.loadNext(key)
  }
}
