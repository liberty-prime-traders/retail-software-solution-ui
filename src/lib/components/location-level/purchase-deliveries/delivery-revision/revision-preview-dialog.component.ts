import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, input, model, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {TableModule} from 'primeng/table'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {Tag} from 'primeng/tag'
import {
  DeliveryLineRevisionPreview
} from '../../../../api/location-level/delivery-revision/delivery-line-revision-preview.model'
import {RevisionPreviewSeverity} from '../../../../api/location-level/delivery-revision/revision-preview-severity.enum'
import {PurchaseDeliveryLine} from '../../../../api/location-level/delivery/purchase-delivery.model'
import {ProductLabelPipe} from '../../../../utils/pipes/product-label.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {MoneyComponent} from '../../../reusable/money.component'

interface SeverityDisplay {
  label: string
  tagSeverity: 'danger' | 'warn' | 'info'
}

@Component({
  selector: 'rts-revision-preview-dialog',
  templateUrl: 'revision-preview-dialog.component.html',
  imports: [
    ButtonDirective,
    CurrencyPipe,
    Dialog,
    EmptyRowComponent,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    TableModule,
    Tag,
    NgClass,
    MoneyComponent
  ]
})
export class RevisionPreviewDialogComponent {
  readonly preview = input.required<DeliveryLineRevisionPreview>()
  readonly deliveryLine = input.required<PurchaseDeliveryLine>()
  readonly saving = input(false)

  readonly visible = model(false)
  readonly saveRequested = output()

  private readonly ledgerLines = computed(() => this.preview().ledgerEntries.flatMap(entry => entry.lines))
  readonly totalDebit = computed(() => this.ledgerLines().reduce((total, line) => total + (line.debit ?? 0), 0))
  readonly totalCredit = computed(() => this.ledgerLines().reduce((total, line) => total + (line.credit ?? 0), 0))
  readonly headerText = computed(() => {
    const productLabel = ProductLabelPipe.prototype.transform(this.deliveryLine().locationProduct!)
    const lineReference = this.preview().revisedDeliveryLineReferenceNumber
    return `Revising Delivery Line # ${lineReference} - ${productLabel}`
  })

  readonly severityDisplay: Record<string, SeverityDisplay> = {
    [RevisionPreviewSeverity.BLOCKS_SAVE]: {label: 'Blocks save', tagSeverity: 'danger'},
    [RevisionPreviewSeverity.WARNING]: {label: 'Warning', tagSeverity: 'warn'},
    [RevisionPreviewSeverity.NOTE]: {label: 'Note', tagSeverity: 'info'}
  }

  close() {
    this.visible.set(false)
  }
}
