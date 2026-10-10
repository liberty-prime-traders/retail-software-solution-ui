import {PrintLayoutError, PrintLayoutKind, PrintOrientation, PrintPaperPreset, PrintUnit} from './print-layout.model'
import {
  buildPageRule,
  createCustomPrintLayout,
  createPresetPrintLayout,
  findPrintLayoutById,
  inches,
  mm,
  PRINT_LAYOUT_PRESETS,
  printableWidthMm,
  toMillimetres,
  uniformMargins,
  validatePrintLayout
} from './print-layout.util'

describe('print layout', () => {

  it('converts units to millimetres without string parsing', () => {
    expect(toMillimetres(inches(1))).toBeCloseTo(25.4)
    expect(toMillimetres({value: 2, unit: PrintUnit.CM})).toBe(20)
  })

  it('compares lengths across units (3in is narrower than 80mm, 4in is wider)', () => {
    expect(toMillimetres(inches(3))).toBeLessThan(toMillimetres(mm(80)))
    expect(toMillimetres(inches(4))).toBeGreaterThan(toMillimetres(mm(80)))
  })

  it('ships only valid presets', () => {
    PRINT_LAYOUT_PRESETS.forEach(layout => expect(validatePrintLayout(layout)).withContext(layout.id).toEqual([]))
  })

  it('swaps sheet dimensions for landscape', () => {
    const portrait = createPresetPrintLayout(PrintPaperPreset.A4)
    const landscape = createPresetPrintLayout(PrintPaperPreset.A4, {orientation: PrintOrientation.LANDSCAPE})
    expect(toMillimetres(landscape.width)).toBe(toMillimetres(portrait.height!))
    expect(toMillimetres(landscape.height!)).toBe(toMillimetres(portrait.width))
    expect(landscape.id).toBe('a4-landscape')
  })

  it('keeps Letter in inches', () => {
    const letter = createPresetPrintLayout(PrintPaperPreset.LETTER)
    expect(letter.width).toEqual(inches(8.5))
    expect(buildPageRule(letter)).toContain('size: 8.5in 11in')
  })

  it('separates nominal width from printable width on receipts', () => {
    const eighty = createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM)
    const fiftyEight = createPresetPrintLayout(PrintPaperPreset.RECEIPT_58MM)
    expect(toMillimetres(eighty.width)).toBe(80)
    expect(printableWidthMm(eighty)).toBe(72)
    expect(printableWidthMm(fiftyEight)).toBe(48)
    expect(eighty.height).toBeNull()
  })

  it('ignores landscape for receipts', () => {
    const receipt = createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM, {orientation: PrintOrientation.LANDSCAPE})
    expect(toMillimetres(receipt.width)).toBe(80)
    expect(receipt.height).toBeNull()
  })

  it('emits a literal page rule for sheets', () => {
    const rule = buildPageRule(createPresetPrintLayout(PrintPaperPreset.A4))
    expect(rule).toBe('@page { size: 210mm 297mm; margin: 15mm 15mm 15mm 15mm; }')
    expect(rule).not.toContain('var(')
  })

  it('sizes a receipt page to its measured content, with slack against rounding', () => {
    const rule = buildPageRule(createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM), 120.2)
    expect(rule).toBe('@page { size: 80mm 123mm; margin: 0; }')
  })

  it('emits a fallback size before `auto` and no margin for unmeasured receipts', () => {
    const rule = buildPageRule(createPresetPrintLayout(PrintPaperPreset.RECEIPT_58MM))
    expect(rule).toBe('@page { size: 58mm 297mm; size: 58mm auto; margin: 0; }')
  })

  it('rejects margins that leave no room for content, comparing across units', () => {
    const problems = validatePrintLayout({
      ...createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM),
      margins: uniformMargins(inches(1.5)) // 2 x 38.1mm > 80mm
    })
    expect(problems.some(p => p.includes('printable width'))).toBeTrue()
  })

  it('rejects invalid custom layouts', () => {
    expect(() => createCustomPrintLayout({kind: PrintLayoutKind.PAGED, width: mm(100)}))
      .toThrowError(PrintLayoutError)
    expect(() => createCustomPrintLayout({kind: PrintLayoutKind.RECEIPT, width: mm(-5)}))
      .toThrowError(PrintLayoutError)
    expect(() => createCustomPrintLayout({kind: PrintLayoutKind.RECEIPT, width: mm(5000)}))
      .toThrowError(PrintLayoutError)
  })

  it('rejects units that are not real units, even ones inherited from Object', () => {
    const width = {value: 80, unit: 'toString' as PrintUnit}
    expect(validatePrintLayout({...createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM), width})).not.toEqual([])
  })

  it('ignores landscape for receipts', () => {
    const layout = createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM, {orientation: PrintOrientation.LANDSCAPE})
    expect(layout.orientation).toBe(PrintOrientation.PORTRAIT)
    expect(layout.id).toBe('receipt-80')
  })

  it('gives custom layouts of different sizes or orientations different ids', () => {
    const portrait = createCustomPrintLayout({kind: PrintLayoutKind.PAGED, width: mm(100), height: mm(150)})
    const landscape = createCustomPrintLayout({
      kind: PrintLayoutKind.PAGED, width: mm(100), height: mm(150), orientation: PrintOrientation.LANDSCAPE
    })
    const taller = createCustomPrintLayout({kind: PrintLayoutKind.PAGED, width: mm(100), height: mm(200)})
    expect(new Set([portrait.id, landscape.id, taller.id]).size).toBe(3)
  })

  it('creates a custom receipt width', () => {
    const layout = createCustomPrintLayout({kind: PrintLayoutKind.RECEIPT, width: mm(76), margins: uniformMargins(mm(3))})
    expect(printableWidthMm(layout)).toBe(70)
  })

  it('finds presets by id', () => {
    expect(findPrintLayoutById('receipt-80')?.kind).toBe(PrintLayoutKind.RECEIPT)
    expect(findPrintLayoutById('nope')).toBeUndefined()
    expect(findPrintLayoutById(null)).toBeUndefined()
  })
})
