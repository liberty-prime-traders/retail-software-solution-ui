export interface PageResponse<CONTENT, METADATA = unknown> {
  currentCursor: string|number
  hasMore: boolean
  contents: CONTENT[]
  requireClientSideFilter: boolean
  /** Endpoint-specific data about the page; absent unless the endpoint sets it. */
  metadata?: METADATA
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
