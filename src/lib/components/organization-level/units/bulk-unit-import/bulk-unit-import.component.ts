import {parseJson} from '@angular/cli/src/utilities/json-file'
import {Component, inject, model, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {InputText} from 'primeng/inputtext'
import {UnitBulkUploadService} from '../../../../api/organization-level/unit-group/unit-bulk-upload.service'
import {
  UnitGroupBulkUploadRequest
} from '../../../../api/organization-level/unit-group/unit-group-bulk-upload-request.dto'
import {parseError} from '../../../../utils/errors'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-bulk-unit-import',
  imports: [
    FormFieldComponent,
    InputText,
    FormsModule,
    Button,
    ErrorSummaryComponent,
    Divider
  ],
  templateUrl: 'bulk-unit-import.component.html'
})
export class BulkUnitImportComponent {

  private readonly unitBulkUploadService = inject(UnitBulkUploadService)

  readonly successfulUpload = output()
  readonly jsonPayload = model<string>('')
  readonly errorDetails = signal<string[]>([])

  readonly FormFieldLayout = FormFieldLayout

  uploadUnits() {
    if (this.jsonPayload()) {
      this.errorDetails.set([])
      this.unitBulkUploadService.uploadUnits(
        parseJson<UnitGroupBulkUploadRequest>(this.jsonPayload()),
        {
          onSuccess: () => this.successfulUpload.emit(),
          onFail: (error) => {
            const errors = parseError(error).concat(error.error.body)
            this.errorDetails.set(errors)
          }
        }
      )
    }
  }

}
