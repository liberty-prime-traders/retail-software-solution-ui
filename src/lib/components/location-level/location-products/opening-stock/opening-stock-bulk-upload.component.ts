import {Component, inject, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {MessageService} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {Dialog} from 'primeng/dialog'
import {Textarea} from 'primeng/textarea'
import {OpeningStockBulkLine} from '../../../../api/location-level/opening-stock/opening-stock.model'
import {
  defaultJsonPayloadFormModel,
  JsonPayloadFormModel,
  jsonNonEmptyArrayPayloadSchema,
  jsonPayloadFieldMap,
  parseJsonPayload
} from '../../../../utils/json-payload'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {OpeningStockDeclarationService} from './opening-stock-declaration.service'

@Component({
  selector: 'rts-opening-stock-bulk-upload',
  templateUrl: 'opening-stock-bulk-upload.component.html',
  imports: [ButtonDirective, Dialog, FormField, Textarea, ErrorSummaryComponent]
})
export class OpeningStockBulkUploadComponent {
  private readonly declarationService = inject(OpeningStockDeclarationService)
  private readonly messageService = inject(MessageService)

  readonly saving = this.declarationService.saving
  readonly dialogVisible = signal(false)
  readonly payloadFormValue = signal<JsonPayloadFormModel>(defaultJsonPayloadFormModel)
  readonly payloadFieldMap = jsonPayloadFieldMap
  readonly payloadForm = form(this.payloadFormValue, jsonNonEmptyArrayPayloadSchema)

  readonly exampleJson = JSON.stringify(
    [{locationProductReferenceNumber: 'LP000001', quantity: 12, unitCode: 'PC', unitCost: 1.5, defaultSalePrice: 2}]
    , null, 4
  )

  openDialog() {
    this.dialogVisible.set(true)
  }

  submit() {
    const lines = parseJsonPayload<OpeningStockBulkLine[]>(this.payloadFormValue().payload)
    this.declarationService.declareBulk(lines, this.messageService, () => {
      this.payloadFormValue.set(defaultJsonPayloadFormModel)
      this.dialogVisible.set(false)
    })
  }
}
