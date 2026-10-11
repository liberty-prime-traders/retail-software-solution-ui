import {Directive, inject, TemplateRef} from '@angular/core'

/**
 * Marks an `<ng-template>` as the document header. Discovered by `rts-print-document` through a content query,
 * so it must be declared directly in the template that hosts `<rts-print-document>` (see README).
 */
@Directive({selector: 'ng-template[rtsPrintHeader]'})
export class PrintHeaderDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef)
}

@Directive({selector: 'ng-template[rtsPrintFooter]'})
export class PrintFooterDirective {
  readonly template = inject<TemplateRef<unknown>>(TemplateRef)
}

/** Hidden in printed output. In the on-screen preview it stays visible but dimmed, so users see what is omitted. */
@Directive({selector: '[rtsPrintHide]', host: {class: 'rts-print-hide'}})
export class PrintHideDirective {}

/**
 * Visible in print output and in the preview (which represents the output), hidden everywhere else in the
 * application. Styling lives in `PrintDocumentComponent`.
 */
@Directive({selector: '[rtsPrintOnly]', host: {class: 'rts-print-only'}})
export class PrintOnlyDirective {}

/** Best-effort `break-inside: avoid`; browsers ignore it for blocks taller than a page. */
@Directive({selector: '[rtsPrintKeepTogether]', host: {class: 'rts-print-keep-together'}})
export class PrintKeepTogetherDirective {}

/** Starts a new page in PAGED layouts. No-op in continuous receipts, where a break would only waste paper. */
@Directive({selector: '[rtsPrintBreakBefore]', host: {class: 'rts-print-break-before'}})
export class PrintBreakBeforeDirective {}

export const PRINT_DIRECTIVES = [
  PrintHeaderDirective,
  PrintFooterDirective,
  PrintHideDirective,
  PrintOnlyDirective,
  PrintKeepTogetherDirective,
  PrintBreakBeforeDirective
] as const
