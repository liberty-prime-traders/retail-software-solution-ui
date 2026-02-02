export declare type CURSOR = string | number

export interface PageRequest<PARAMETER> {
  previousCursor: CURSOR
  requestedSize: number
  parameters: PARAMETER
}
