export interface PaginatedState<PARAMETERS> {
  currentCursor: number
  hasMore: boolean
  lastSearchParams: PARAMETERS
}

export const createDefaultPaginatedState = <PARAMETERS>(): PaginatedState<PARAMETERS> => ({
  currentCursor: 0,
  hasMore: false,
  lastSearchParams: {} as PARAMETERS
})
