import {PaginatedBaseService} from './paginated-base.service'
import {PaginatedModel} from './paginated.model'

export const loadNextOnLazyLoad = <RESPONSE extends PaginatedModel, PARAMETERS>(
  paginatedService: PaginatedBaseService<RESPONSE, PARAMETERS>,
  last: number | undefined
): void => {
  const loadedRowCount = paginatedService.getPaginatedCount()
  const overlapThreshold = 5
  if (Math.abs(loadedRowCount - (last ?? 0)) <= overlapThreshold) {
    paginatedService.loadNext()
  }
}
