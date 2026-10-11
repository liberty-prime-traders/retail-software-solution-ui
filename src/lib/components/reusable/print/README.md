# Print framework

Generic, content-projection-first printing. The infrastructure owns the **paper surface, layout, preview and
native printing**; features own **what is on the paper**. Nothing here knows what a sale, total or customer is, and
nothing here imports PrimeNG.

| Piece | Role |
|---|---|
| `PrintLayout`, `PRINT_LAYOUT_PRESETS`, `createPresetPrintLayout`, `createCustomPrintLayout` | Typed, validated layouts. Physical units are preserved; lengths are compared in millimetres, never by `parseFloat`. |
| `rts-print-document` | The paper surface. Projects any content; optional `rtsPrintHeader` / `rtsPrintFooter` templates. |
| `rts-print-preview` | On-screen desk (backdrop, shadow, zoom) around a document. Preview chrome never reaches paper. |
| `PrintService` | `print(surface, layout)` - native print in an isolated, hidden iframe. |
| `rtsPrintHide`, `rtsPrintOnly`, `rtsPrintKeepTogether`, `rtsPrintBreakBefore` | Host-class directives; the behaviour is CSS. |

No dependencies were added.

## Example 1 - a sale (feature-owned content)

```html
<rts-print-document [layout]="layout()">
  <ng-template rtsPrintHeader>
    <div class="branding">{{ organizationName() }}</div>
  </ng-template>

  <rts-sale-print-content [sale]="sale()" [layout]="layout()" />

  <ng-template rtsPrintFooter>
    <p>Thank you for shopping with us.</p>
  </ng-template>
</rts-print-document>
```

See `components/location-level/sales/sale-print/`. `SalePrintActionsComponent` adds the Print / Preview buttons
to the sale header, remembers the chosen paper in local storage, and declares the document **once** in an
`ng-template`, rendering it off-screen for a direct print or inside the preview dialog - never twice.

## Example 2 - an unrelated document (no header/footer at all)

```ts
@Component({
  selector: 'rts-shelf-labels',
  imports: [PrintDocumentComponent, PrintPreviewComponent, PrintKeepTogetherDirective],
  template: `
    <rts-print-preview>
      <rts-print-document #doc [layout]="layout">
        @for (label of labels(); track label.sku) {
          <section rtsPrintKeepTogether>
            <h2>{{ label.name }}</h2>
            <p>{{ label.sku }}</p>
          </section>
        }
      </rts-print-document>
    </rts-print-preview>
    <button (click)="print(doc.element)">Print</button>
  `
})
export class ShelfLabelsComponent {
  private readonly printService = inject(PrintService)
  readonly layout = createCustomPrintLayout({kind: PrintLayoutKind.PAGED, width: mm(100), height: mm(150)})
  readonly labels = input.required<Label[]>()

  print(surface: HTMLElement) {
    this.printService.print(surface, this.layout).catch(error => console.log(/* PrintError | PrintLayoutError ...*/))
  }
}
```

## Layouts

```ts
createPresetPrintLayout(PrintPaperPreset.A4)                                   // portrait
createPresetPrintLayout(PrintPaperPreset.LETTER, {orientation: PrintOrientation.LANDSCAPE})
createPresetPrintLayout(PrintPaperPreset.RECEIPT_80MM)
createCustomPrintLayout({kind: PrintLayoutKind.RECEIPT, width: mm(76), margins: uniformMargins(mm(3))})
```

* PAGED: width/height are the portrait dimensions you give; `LANDSCAPE` swaps them. Margins become the `@page` margin.
* RECEIPT: no fixed height. Nominal width (`width`) and printable width (`width - left - right`) are separate:
  presets use 72 mm printable on 80 mm and 48 mm on 58 mm, leaving room for hardware margins. `@page` margin is 0
  and the margins are applied as document padding, because thermal drivers apply their own non-printable area.
* `validatePrintLayout` / `PrintLayoutError` reject non-positive or absurd sizes and margins that leave under
  30 mm of content.

## Directives - what they actually do

| Directive | Print output | Preview | Elsewhere in the app |
|---|---|---|---|
| `rtsPrintHide` | removed | shown, dimmed with a dashed outline | untouched |
| `rtsPrintOnly` | shown | shown | **hidden** (when not inside a `rts-print-document`) |
| `rtsPrintKeepTogether` | `break-inside: avoid` (best effort) | no effect | untouched |
| `rtsPrintBreakBefore` | `break-before: page` in PAGED layouts only | no effect | untouched |

`rtsPrintHeader` / `rtsPrintFooter` are marker directives on `ng-template`. They render **once**, at the top and
bottom of the document flow. They do **not** repeat on every physical page. (For a repeating table header, use a
real `<thead>`; browsers repeat it across pages.)

### How nested content is queried

`rts-print-document` finds header/footer with `contentChild`. That sees templates declared **in the template that
contains `<rts-print-document>`**, at any nesting depth of that template. It does **not** see templates declared
inside the view of a child component (e.g. inside `<rts-sale-print-content>`'s own template). Declare the
header/footer where the document is declared. The other four directives are plain class markers, so they work
anywhere in projected content, including inside child component templates.

## How printing works (and why)

`PrintService.print` copies the rendered surface and the application's `<style>`/stylesheet `<link>` elements
into a hidden same-origin iframe and prints only that iframe.

* **Isolation:** sidebars, PrimeNG overlays, dialogs, toolbars and scroll containers are not in the frame, so they
  cannot leak into the printout, and no global `@media print` rules are added to the app.
* **`@page`:** CSS custom properties are not reliably valid in `@page`, so a literal rule is generated from the
  layout and injected into the frame for that job only.
* **Receipts:** `@page { size: 80mm auto }` is not honoured everywhere (current Chrome ignores `auto` and paginates
  at its fallback height - verified). After fonts/images are ready the service measures the receipt and emits an
  explicit page height, so the roll prints as one continuous page. If measurement is impossible it emits a
  fallback height followed by `auto`.
* **Readiness:** waits for stylesheet `load`, `document.fonts.ready` and image `decode()` - no fixed timeouts.
* **Lifecycle:** resolves when the dialog closes (`afterprint`, or leaving the `print` media query for Safari).
  Printed or cancelled cannot be distinguished by browsers. A second call during a job returns the same promise.
  The frame is removed when the job ends and when the service is destroyed.
* **No side effects:** the frame holds a static DOM snapshot - no component code runs, no data is fetched again.
* **Failure:** rejects with `PrintError` (`UNSUPPORTED`: no window/print support, e.g. SSR or some embedded
  webviews; `FRAME_FAILED`) or `PrintLayoutError` (bad layout). No popups are opened, so popup blockers do not apply.

Paper is always rendered black on white regardless of the app's dark theme.

## Supported layouts

| Layout | Page size | Margins | Pagination | Notes |
|---|---|---|---|---|
| A4 portrait / landscape | 210 x 297 mm | 15 mm (`@page`) | browser, multi-page | repeating `<thead>` |
| US Letter portrait / landscape | 8.5 x 11 in | 0.6 in (`@page`) | browser, multi-page | repeating `<thead>` |
| 80 mm receipt | 80 mm x content | 0 `@page`; 4 mm side padding (72 mm printable) | none (continuous) | page breaks ignored |
| 58 mm receipt | 58 mm x content | 0 `@page`; 5 mm side padding (48 mm printable) | none (continuous) | page breaks ignored |
| Custom | any, up to 2000 mm | any | by kind | validated |

## Limitations

* No JavaScript page splitting. `break-inside: avoid` and `thead` repetition are best effort and browser dependent;
  a block taller than a page is split anyway.
* The preview is one continuous sheet-width column; it does **not** draw page boundaries. Final pagination is only
  visible in the browser's print dialog.
* Page size and margins in `@page` are honoured by Chromium and Firefox; Safari may override them with the print
  dialog's paper settings. Users should select the matching paper in the dialog; on thermal printers the driver's
  roll size takes precedence over CSS in some setups.
* The user must still click Print in the browser dialog (browsers do not allow silent printing).
* "Printed" vs "cancelled" is not detectable.
* Text stays selectable/searchable only when the user chooses "Save as PDF" in the dialog; this is not an export
  feature.
* Receipt printable widths (72/48 mm) are typical head widths, not a guarantee for every model; use
  `createCustomPrintLayout` to tune.

## Manual validation

Run the app, open a confirmed sale with several lines (include one very long product name and one price override,
plus a voided payment), then use **Preview** and **Print**. In the print dialog turn off "Headers and footers" and
set Margins to *Default*/*None* as noted.

1. **A4** - Paper "A4". Expect a heading, a customer/date grid, a table with repeated header on page 2 if long, totals
   block kept together, no app chrome, 15 mm margins, white background even in dark mode.
2. **Letter** - choose "US Letter". Same checks, paper size reads Letter; confirm 8.5 x 11 in.
3. **A4 landscape / Letter landscape** - the dialog should switch to landscape automatically; table fills the width.
4. **80 mm** - choose "80 mm receipt" (system PDF printer is fine). Expect a single narrow page whose length matches
   the content (not a 297 mm page with blank space), stacked lines, amounts right aligned, long name wrapping
   onto several lines, dashed separators, voided payment absent.
5. **58 mm** - same; nothing clipped on the right, no label overlapping an amount.
6. **Isolation** - open the preview from a screen with a sidebar and open dialogs behind it; none appear in the print.
7. **Repeat** - press Print twice quickly: only one dialog opens. Cancel, then print again: works.
8. **Hide/only** - elements with `rtsPrintHide` appear dimmed in preview and are absent when printed.
9. **Unsupported** - in a browser where `window.print` is unavailable, a toast "Unable to print" is shown.

Automated coverage: `print-layout.util.spec.ts` (units, presets, validation, `@page` output),
`print-document.component.spec.ts` (projection, header/footer, directives, CSS semantics),
`print.service.spec.ts` (isolated frame, `@page`, reuse, cleanup, unsupported),
`sale-print-content.component.spec.ts` (sheet vs receipt structure, overflow at 58/80 mm).
