import {NgTemplateOutlet} from '@angular/common'
import {
  afterNextRender,
  Component,
  computed,
  inject,
  Injector,
  input,
  signal,
  viewChild
} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MessageService} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {Select} from 'primeng/select'
import {SaleSession} from '../../../../api/location-level/sale_session/sale-session.model'
import {LocalStorageService} from '../../../../utils/services/local-storage.service'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {LocalStorageKey} from '../../../../utils/types/local-storage-key.enum'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {
  findPrintLayoutById,
  PRINT_LAYOUT_PRESETS,
  PrintDocumentComponent,
  PrintError,
  PrintFooterDirective,
  PrintHeaderDirective,
  PrintLayout,
  PrintLayoutKind,
  PrintPreviewComponent,
  PrintService
} from '../../../reusable/print'
import {SalePrintContentComponent} from './sale-print-content.component'

@Component({
  selector: 'rts-sale-print-actions',
  templateUrl: 'sale-print-actions.component.html',
  styleUrl: 'sale-print-actions.component.scss',
  imports: [
    NgTemplateOutlet,
    FormsModule,
    ButtonDirective,
    Dialog,
    Select,
    NullSafePipe,
    PrintDocumentComponent,
    PrintPreviewComponent,
    PrintHeaderDirective,
    PrintFooterDirective,
    SalePrintContentComponent
  ]
})
export class SalePrintActionsComponent {
  private readonly injector = inject(Injector)
  private readonly printService = inject(PrintService)
  private readonly messageService = inject(MessageService)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly sessionContext = inject(SessionContextService)

  readonly sale = input.required<SaleSession>()

  readonly layouts = [...PRINT_LAYOUT_PRESETS]
  readonly isPrinting = this.printService.isPrinting

  private readonly _layout = signal<PrintLayout>(this.loadRememberedLayout())
  readonly layout = this._layout.asReadonly()
  readonly previewVisible = signal(false)
  private readonly _renderedOffScreenForPrint = signal(false)
  readonly renderedOffScreenForPrint = this._renderedOffScreenForPrint.asReadonly()

  readonly organizationName = computed(() => this.sessionContext.selectedOrganization()?.name)
  readonly locationName = computed(() => this.sessionContext.selectedLocation()?.name)
  readonly previewZoom = computed(() => this.layout().kind === PrintLayoutKind.RECEIPT ? 1.5 : 0.85)

  private readonly printDocument = viewChild(PrintDocumentComponent)

  openPreview() {
    this.previewVisible.set(true)
  }

  changeLayout(layout: PrintLayout) {
    this._layout.set(layout)
    this.localStorageService.setItem(LocalStorageKey.PRINT_LAYOUT, layout.id)
  }

  printNow() {
    if (this.previewVisible()) {
      this.sendToPrinter()
    } else {
      this._renderedOffScreenForPrint.set(true)
      afterNextRender(() => this.sendToPrinter(), {injector: this.injector})
    }
  }

  private sendToPrinter() {
    const printDocument = this.printDocument()
    if (printDocument) {
      this.printService.print(printDocument.element, this.layout())
        .catch(error => this.reportFailure(error))
        .finally(() => this._renderedOffScreenForPrint.set(false))
    } else {
      this._renderedOffScreenForPrint.set(false)
    }
  }

  private reportFailure(error: unknown) {
    console.error('Printing failed', error)
    const detail = error instanceof PrintError ? error.message : 'The sale could not be printed.'
    this.messageService.add({severity: 'error', summary: 'Unable to print', detail})
  }

  private loadRememberedLayout(): PrintLayout {
    const rememberedId = this.localStorageService.getItem<string>(LocalStorageKey.PRINT_LAYOUT)
    return findPrintLayoutById(rememberedId) ?? PRINT_LAYOUT_PRESETS[0]
  }
}
