import {
  CustomPrintLayoutOptions,
  PrintLayout,
  PrintLayoutError,
  PrintLayoutKind,
  PrintLength,
  PrintMargins,
  PrintOrientation,
  PrintPaperPreset,
  PrintUnit
} from './print-layout.model'

const MM_PER_UNIT: Record<PrintUnit, number> = {
  [PrintUnit.MM]: 1,
  [PrintUnit.CM]: 10,
  [PrintUnit.IN]: 25.4
}

/** Smallest usable content box in either direction. Anything below this cannot hold a readable line of text. */
export const MIN_PRINTABLE_SIZE_MM = 30
/** Sanity bounds so a typo (e.g. 2100 instead of 210) is rejected instead of producing an absurd page. */
export const MAX_DIMENSION_MM = 2000
/** Slack added to a measured receipt height so sub-pixel rounding cannot spill a blank second page. */
export const RECEIPT_HEIGHT_ALLOWANCE_MM = 2

export const mm = (value: number): PrintLength => ({value, unit: PrintUnit.MM})
export const inches = (value: number): PrintLength => ({value, unit: PrintUnit.IN})

export const toMillimetres = (length: PrintLength): number => length.value * MM_PER_UNIT[length.unit]

export const toCss = (length: PrintLength): string => `${trimNumber(length.value)}${length.unit}`

/** Millimetres expressed as CSS, for derived values (e.g. printable width) whose original unit is irrelevant. */
export const millimetresToCss = (millimetres: number): string => `${trimNumber(millimetres)}mm`

const trimNumber = (value: number): string => String(Math.round(value * 1000) / 1000)

export const uniformMargins = (length: PrintLength): PrintMargins => ({
  top: length, right: length, bottom: length, left: length
})

export const horizontalMarginsMm = (margins: PrintMargins): number =>
  toMillimetres(margins.left) + toMillimetres(margins.right)

export const verticalMarginsMm = (margins: PrintMargins): number =>
  toMillimetres(margins.top) + toMillimetres(margins.bottom)

/** Width of the box the content actually flows in, after margins/hardware allowance. */
export const printableWidthMm = (layout: PrintLayout): number =>
  toMillimetres(layout.width) - horizontalMarginsMm(layout.margins)

/** PAGED only. Null for continuous receipts. */
export const printableHeightMm = (layout: PrintLayout): number | null =>
  layout.height ? toMillimetres(layout.height) - verticalMarginsMm(layout.margins) : null

const lengthProblems = (name: string, length: PrintLength | null | undefined, allowZero: boolean): string[] => {
  if (!length || !Number.isFinite(length.value) || !Object.hasOwn(MM_PER_UNIT, length.unit)) {
    return [`${name} is not a valid length`]
  }
  const millimetres = toMillimetres(length)
  if (millimetres < 0 || (!allowZero && millimetres === 0)) {
    return [`${name} must be ${allowZero ? 'zero or more' : 'greater than zero'}`]
  }
  if (millimetres > MAX_DIMENSION_MM) {
    return [`${name} exceeds ${MAX_DIMENSION_MM}mm`]
  }
  return []
}

/** Returns a list of human readable problems; empty when the layout is usable. */
export const validatePrintLayout = (layout: PrintLayout): string[] => {
  const problems = [
    ...lengthProblems('width', layout.width, false),
    ...lengthProblems('margin-top', layout.margins?.top, true),
    ...lengthProblems('margin-right', layout.margins?.right, true),
    ...lengthProblems('margin-bottom', layout.margins?.bottom, true),
    ...lengthProblems('margin-left', layout.margins?.left, true)
  ]

  if (layout.kind === PrintLayoutKind.PAGED) {
    problems.push(...lengthProblems('height', layout.height, false))
  } else if (layout.height !== null) {
    problems.push('a receipt layout must not have a fixed height')
  }
  if (problems.length > 0) {
    return problems
  }

  if (printableWidthMm(layout) < MIN_PRINTABLE_SIZE_MM) {
    problems.push(`printable width must be at least ${MIN_PRINTABLE_SIZE_MM}mm after margins`)
  }
  const printableHeight = printableHeightMm(layout)
  if (printableHeight !== null && printableHeight < MIN_PRINTABLE_SIZE_MM) {
    problems.push(`printable height must be at least ${MIN_PRINTABLE_SIZE_MM}mm after margins`)
  }
  return problems
}

export const assertValidPrintLayout = (layout: PrintLayout): PrintLayout => {
  const problems = validatePrintLayout(layout)
  if (problems.length > 0) {
    throw new PrintLayoutError(problems)
  }
  return layout
}

/**
 * Builds a layout from arbitrary dimensions. For PAGED layouts the given width/height are the portrait
 * dimensions and LANDSCAPE swaps them, so callers never swap by hand.
 */
const customLayoutId = (options: CustomPrintLayoutOptions, orientation: PrintOrientation): string => {
  const size = [options.width, options.height].filter(length => !!length).map(length => toCss(length!)).join('x')
  return `custom-${options.kind}-${size}-${orientation}`.toLowerCase()
}

export const createCustomPrintLayout = (options: CustomPrintLayoutOptions): PrintLayout => {
  const isPaged = options.kind === PrintLayoutKind.PAGED
  const orientation = isPaged ? options.orientation ?? PrintOrientation.PORTRAIT : PrintOrientation.PORTRAIT
  const swap = isPaged && orientation === PrintOrientation.LANDSCAPE && !!options.height

  const layout: PrintLayout = {
    id: options.id ?? customLayoutId(options, orientation),
    label: options.label ?? 'Custom',
    kind: options.kind,
    width: swap ? options.height! : options.width,
    height: isPaged ? (swap ? options.width : options.height ?? null) : null,
    margins: options.margins ?? uniformMargins(mm(isPaged ? 10 : 2)),
    orientation
  }
  return assertValidPrintLayout(layout)
}

const A4 = {width: mm(210), height: mm(297)}
const LETTER = {width: inches(8.5), height: inches(11)}

/**
 * Receipt printable widths follow the usual thermal head widths (72mm on an 80mm roll, 48mm on a 58mm roll),
 * expressed as symmetric margins so nominal width and printable width stay separate concepts.
 */
const presetOptions = (preset: PrintPaperPreset): CustomPrintLayoutOptions => {
  switch (preset) {
    case PrintPaperPreset.A4:
      return {id: 'a4', label: 'A4', kind: PrintLayoutKind.PAGED, ...A4, margins: uniformMargins(mm(15))}
    case PrintPaperPreset.LETTER:
      return {id: 'letter', label: 'US Letter', kind: PrintLayoutKind.PAGED, ...LETTER, margins: uniformMargins(inches(0.6))}
    case PrintPaperPreset.RECEIPT_80MM:
      return {
        id: 'receipt-80', label: '80 mm receipt', kind: PrintLayoutKind.RECEIPT, width: mm(80),
        margins: {top: mm(3), bottom: mm(6), left: mm(4), right: mm(4)}
      }
    case PrintPaperPreset.RECEIPT_58MM:
      return {
        id: 'receipt-58', label: '58 mm receipt', kind: PrintLayoutKind.RECEIPT, width: mm(58),
        margins: {top: mm(3), bottom: mm(6), left: mm(5), right: mm(5)}
      }
  }
}

export interface PresetLayoutOptions {
  orientation?: PrintOrientation
  margins?: PrintMargins
}

/** Orientation is ignored for receipts: a roll has a width and an open-ended length. */
export const createPresetPrintLayout = (preset: PrintPaperPreset, options: PresetLayoutOptions = {}): PrintLayout => {
  const base = presetOptions(preset)
  const layout = createCustomPrintLayout({
    ...base,
    orientation: options.orientation,
    margins: options.margins ?? base.margins
  })
  if (layout.orientation === PrintOrientation.LANDSCAPE) {
    return {...layout, id: `${layout.id}-landscape`, label: `${layout.label} (landscape)`}
  }
  return layout
}

export const PRINT_LAYOUT_PRESETS: readonly PrintLayout[] = [
  createPresetPrintLayout(PrintPaperPreset.A4),
  createPresetPrintLayout(PrintPaperPreset.A4, {orientation: PrintOrientation.LANDSCAPE}),
  createPresetPrintLayout(PrintPaperPreset.LETTER),
  createPresetPrintLayout(PrintPaperPreset.LETTER, {orientation: PrintOrientation.LANDSCAPE}),
  createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM),
  createPresetPrintLayout(PrintPaperPreset.RECEIPT_58MM)
]

export const findPrintLayoutById = (id: string | null | undefined): PrintLayout | undefined =>
  PRINT_LAYOUT_PRESETS.find(layout => layout.id === id)

/**
 * Literal `@page` rule. CSS custom properties are not valid inside `@page` in all browsers, so the rule is
 * generated from the layout's concrete values at print time.
 *
 * Receipts: browsers do not agree on `size: <width> auto` (Chrome ignores it and paginates at its fallback
 * height), so when the rendered content height is known it becomes the explicit page height, giving one
 * continuous page. Without a measurement, two `size` declarations are emitted instead: an explicit fallback
 * height first, then `auto` - browsers that reject `auto` drop that declaration and keep the first.
 */
export const buildPageRule = (layout: PrintLayout, receiptContentHeightMm?: number): string => {
  const width = toCss(layout.width)
  if (layout.kind === PrintLayoutKind.RECEIPT) {
    if (receiptContentHeightMm && receiptContentHeightMm > 0) {
      return `@page { size: ${width} ${millimetresToCss(Math.ceil(receiptContentHeightMm) + RECEIPT_HEIGHT_ALLOWANCE_MM)}; margin: 0; }`
    }
    return `@page { size: ${width} 297mm; size: ${width} auto; margin: 0; }`
  }
  const m = layout.margins
  const margin = [m.top, m.right, m.bottom, m.left].map(toCss).join(' ')
  return `@page { size: ${width} ${toCss(layout.height!)}; margin: ${margin}; }`
}
