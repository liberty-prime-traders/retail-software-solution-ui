export interface PageResponse<CONTENT> {
  currentCursor: number
  hasMore: boolean
  contents: CONTENT[]
}
