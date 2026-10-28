import {Component, computed, inject, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {InputText} from 'primeng/inputtext'
import {ContactBulkUploadDto} from '../../../../api/organization-level/contact/contact-bulk-upload.dto'
import {ContactBulkUploadService} from '../../../../api/organization-level/contact/contact-bulk-upload.service'
import {parseError} from '../../../../utils/errors'
import {defaultJsonPayloadFormModel, JsonPayloadFormModel, jsonPayloadFieldMap, jsonPayloadSchema, parseJsonPayload} from '../../../../utils/json-payload'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'

@Component({
  selector: 'rts-bulk-contact-import',
  imports: [
    FormFieldComponent,
    InputText,
    FormField,
    ButtonDirective,
    ErrorSummaryComponent,
    Divider,
    LoadingContainerComponent,
    AutoStretchDirective
  ],
  templateUrl: 'bulk-contact-import.component.html'
})
export class BulkContactImportComponent {

  private readonly contactBulkUploadService = inject(ContactBulkUploadService)

  readonly successfulUpload = output()
  readonly payloadFormValue = signal<JsonPayloadFormModel>(defaultJsonPayloadFormModel)
  readonly payloadFieldMap = jsonPayloadFieldMap
  readonly payloadForm = form(this.payloadFormValue, jsonPayloadSchema)
  readonly errorDetails = signal<string[]>([])
  readonly errorsFound = computed(() => this.errorDetails().length > 0)
  readonly uploadInProgress = this.contactBulkUploadService.selectLoading

  readonly FormFieldLayout = FormFieldLayout

  uploadContacts() {
    if (this.payloadForm().valid()) {
      this.errorDetails.set([])
      this.contactBulkUploadService.uploadContacts(
        parseJsonPayload<ContactBulkUploadDto[]>(this.payloadFormValue().payload),
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
