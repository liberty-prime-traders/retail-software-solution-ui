import {Component, input, ViewEncapsulation} from '@angular/core'

/**
 * On-screen "desk" for a `rts-print-document`: neutral backdrop, shadow and scrolling. These frills belong to the
 * preview only - `PrintService` prints the document surface itself, so none of this reaches the paper.
 *
 * The preview shows one sheet-width of continuous content; it does not simulate page breaks.
 */
@Component({
  selector: 'rts-print-preview',
  encapsulation: ViewEncapsulation.None,
  host: {class: 'rts-print-preview', role: 'region', 'aria-label': 'Print preview'},
  template: `
    <div class="rts-print-preview__sheet" [style.zoom]="zoom()">
      <ng-content />
    </div>
  `,
  styles: `
    .rts-print-preview {
      display: block;
      overflow: auto;
      padding: 1rem;
      background: #6b7280;
      max-height: 100%;
    }

    .rts-print-preview__sheet {
      width: max-content;
      max-width: none;
      margin: 0 auto;
      box-shadow: 0 2px 12px rgba(0, 0, 0, .45);
    }
  `
})
export class PrintPreviewComponent {
  /** 1 = 100%. Uses CSS `zoom`, which (unlike transform) keeps the scroll area the right size. */
  readonly zoom = input(1)
}
