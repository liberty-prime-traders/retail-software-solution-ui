import {Component, computed, inject, model, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {InputText} from 'primeng/inputtext'
import {ProductBulkUploadRequest} from '../../../../api/organization-level/product/product-bulk-upload-request.dto'
import {ProductBulkUploadService} from '../../../../api/organization-level/product/product-bulk-upload.service'
import {parseError} from '../../../../utils/errors'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'

@Component({
  selector: 'rts-bulk-product-import',
  imports: [
    FormFieldComponent,
    InputText,
    FormsModule,
    ButtonDirective,
    ErrorSummaryComponent,
    Divider,
    LoadingContainerComponent
  ],
  templateUrl: 'bulk-product-import.component.html'
})
export class BulkProductImportComponent {

  private readonly productBulkUploadService = inject(ProductBulkUploadService)

  readonly successfulUpload = output()
  readonly jsonPayload = model<string>('')
  readonly errorDetails = signal<string[]>([])
  readonly errorsFound = computed(() => this.errorDetails().length > 0)
  readonly uploadInProgress = this.productBulkUploadService.selectLoading

  readonly FormFieldLayout = FormFieldLayout

  uploadProducts() {
    if (this.jsonPayload()) {
      this.errorDetails.set([])
      this.productBulkUploadService.uploadProducts(
        JSON.parse(this.jsonPayload()) as ProductBulkUploadRequest,
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
