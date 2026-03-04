export interface PageResponse<CONTENT> {
  currentCursor: string|number
  hasMore: boolean
  contents: CONTENT[]
  requireClientSideFilter: boolean
}

export const isPaginated = <T>(response: any): response is PageResponse<T> => {
  return (
    response
    && (typeof response.currentCursor === 'string' || typeof response.currentCursor === 'number')
    && typeof response.hasMore === 'boolean'
    && Array.isArray(response.contents)
    && typeof response.requireClientSideFilter === 'boolean'
  )
}
