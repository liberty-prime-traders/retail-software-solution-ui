import {Component, computed, inject, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {InputText} from 'primeng/inputtext'
import {UnitBulkUploadService} from '../../../../api/organization-level/unit-group/unit-bulk-upload.service'
import {
  UnitGroupBulkUploadRequest
} from '../../../../api/organization-level/unit-group/unit-group-bulk-upload-request.dto'
import {parseError} from '../../../../utils/errors'
import {defaultJsonPayloadFormModel, JsonPayloadFormModel, jsonPayloadFieldMap, jsonPayloadSchema, parseJsonPayload} from '../../../../utils/json-payload'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-bulk-unit-import',
  imports: [
    FormFieldComponent,
    InputText,
    FormField,
    ButtonDirective,
    ErrorSummaryComponent,
    Divider
  ],
  templateUrl: 'bulk-unit-import.component.html'
})
export class BulkUnitImportComponent {

  private readonly unitBulkUploadService = inject(UnitBulkUploadService)

  readonly successfulUpload = output()
  readonly payloadFormValue = signal<JsonPayloadFormModel>(defaultJsonPayloadFormModel)
  readonly payloadFieldMap = jsonPayloadFieldMap
  readonly payloadForm = form(this.payloadFormValue, jsonPayloadSchema)
  readonly errorDetails = signal<string[]>([])
  readonly errorsFound = computed(() => this.errorDetails().length > 0)

  readonly FormFieldLayout = FormFieldLayout

  readonly examplePayload = JSON.stringify({
    unitGroups: [{
      name: 'Weight',
      description: 'Units of mass',
      baseUnitName: 'Gram',
      baseUnitCode: 'G',
      unitValues: [
        {name: 'Kilogram', code: 'KG', description: null, baseUnitCode: 'G', unitsOfBasePerUnit: 1000}
      ]
    }]
  }, null, 2)

  uploadUnits() {
    if (this.payloadForm().valid()) {
      this.errorDetails.set([])
      this.unitBulkUploadService.uploadUnits(
        parseJsonPayload<UnitGroupBulkUploadRequest>(this.payloadFormValue().payload),
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
