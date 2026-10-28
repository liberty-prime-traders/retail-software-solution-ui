import {Component, computed, inject, model, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {InputText} from 'primeng/inputtext'
import {ContactBulkUploadDto} from '../../../../api/organization-level/contact/contact-bulk-upload.dto'
import {ContactBulkUploadService} from '../../../../api/organization-level/contact/contact-bulk-upload.service'
import {parseError} from '../../../../utils/errors'
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
    FormsModule,
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
  readonly jsonPayload = model<string>('')
  readonly errorDetails = signal<string[]>([])
  readonly errorsFound = computed(() => this.errorDetails().length > 0)
  readonly uploadInProgress = this.contactBulkUploadService.selectLoading

  readonly FormFieldLayout = FormFieldLayout

  uploadContacts() {
    if (this.jsonPayload()) {
      this.errorDetails.set([])
      this.contactBulkUploadService.uploadContacts(
        JSON.parse(this.jsonPayload()) as ContactBulkUploadDto[],
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
