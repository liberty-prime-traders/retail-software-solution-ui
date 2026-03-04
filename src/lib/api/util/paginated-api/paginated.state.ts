export interface PaginatedState<PARAMETERS> {
  currentCursor: string|number
  hasMore: boolean
  requireClientSideFilter: boolean
  lastSearchParams: PARAMETERS
}

export const createDefaultPaginatedState = <PARAMETERS>(): PaginatedState<PARAMETERS> => ({
  currentCursor: 0,
  hasMore: false,
  requireClientSideFilter: false,
  lastSearchParams: {} as PARAMETERS
})
