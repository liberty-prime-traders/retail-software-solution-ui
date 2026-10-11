/**
 * Physical units are kept explicit end to end. Values are only converted (to millimetres) when two lengths
 * have to be compared or combined; they are never compared through parseFloat on CSS strings.
 * Enum values are real CSS units because they are emitted verbatim into stylesheets.
 */
export enum PrintUnit {
  MM = 'mm',
  CM = 'cm',
  IN = 'in'
}

export interface PrintLength {
  value: number
  unit: PrintUnit
}

export enum PrintLayoutKind {
  /** Fixed-size sheets (A4, Letter, custom). The browser paginates. */
  PAGED = 'PAGED',
  /** Roll paper: fixed width, height grows with the content. */
  RECEIPT = 'RECEIPT'
}

export enum PrintOrientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE'
}

export enum PrintPaperPreset {
  A4 = 'A4',
  LETTER = 'LETTER',
  RECEIPT_80MM = 'RECEIPT_80MM',
  RECEIPT_58MM = 'RECEIPT_58MM'
}

export interface PrintMargins {
  top: PrintLength
  right: PrintLength
  bottom: PrintLength
  left: PrintLength
}

export interface PrintLayout {
  /** Stable identifier, e.g. for remembering a user's choice. */
  id: string
  label: string
  kind: PrintLayoutKind
  /**
   * PAGED: sheet width (already swapped for landscape).
   * RECEIPT: nominal paper width, i.e. what is printed on the roll's box.
   */
  width: PrintLength
  /** PAGED only: sheet height (already swapped for landscape). Always null for RECEIPT. */
  height: PrintLength | null
  /**
   * PAGED: applied as the @page margin.
   * RECEIPT: applied as inner padding of the document (the @page margin is 0) so that the printable width
   * is narrower than the nominal width, leaving room for hardware margins.
   */
  margins: PrintMargins
  orientation: PrintOrientation
}

export interface CustomPrintLayoutOptions {
  id?: string
  label?: string
  kind: PrintLayoutKind
  width: PrintLength
  height?: PrintLength
  margins?: PrintMargins
  orientation?: PrintOrientation
}

export class PrintLayoutError extends Error {
  constructor(readonly problems: string[]) {
    super(`Invalid print layout: ${problems.join('; ')}`)
    this.name = 'PrintLayoutError'
  }
}
