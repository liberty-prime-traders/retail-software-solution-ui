import {CURSOR} from '../paginated-api/page-request.model'

export interface KeyedPageState<PARAMETERS> {
  currentCursor: CURSOR
  hasMore: boolean
  requireClientSideFilter: boolean
  loading: boolean
  parameters: PARAMETERS
  requestId: number
}
