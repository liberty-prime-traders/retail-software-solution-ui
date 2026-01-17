export interface PageRequest<PARAMETER> {
  previousCursor: number
  requestedSize: number
  parameters: PARAMETER
}
