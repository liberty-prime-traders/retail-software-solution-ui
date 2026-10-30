import {Component, computed, inject, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {InputText} from 'primeng/inputtext'
import {ProductBulkUploadRequest} from '../../../../api/organization-level/product/product-bulk-upload-request.dto'
import {ProductBulkUploadService} from '../../../../api/organization-level/product/product-bulk-upload.service'
import {parseError} from '../../../../utils/errors'
import {defaultJsonPayloadFormModel, JsonPayloadFormModel, jsonPayloadFieldMap, jsonPayloadSchema, parseJsonPayload} from '../../../../utils/json-payload'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'

@Component({
  selector: 'rts-bulk-product-import',
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
  templateUrl: 'bulk-product-import.component.html'
})
export class BulkProductImportComponent {

  private readonly productBulkUploadService = inject(ProductBulkUploadService)

  readonly successfulUpload = output()
  readonly payloadFormValue = signal<JsonPayloadFormModel>(defaultJsonPayloadFormModel)
  readonly payloadFieldMap = jsonPayloadFieldMap
  readonly payloadForm = form(this.payloadFormValue, jsonPayloadSchema)
  readonly errorDetails = signal<string[]>([])
  readonly errorsFound = computed(() => this.errorDetails().length > 0)
  readonly uploadInProgress = this.productBulkUploadService.selectLoading

  readonly FormFieldLayout = FormFieldLayout

  readonly examplePayload = JSON.stringify({
    categories: [{name: 'Beverages', description: 'Drinks'}],
    productGroups: [{name: 'Soft Drinks', categoryName: 'Beverages', description: null}],
    products: [{name: 'Cola 500ml', description: null, groupName: 'Soft Drinks', unitCode: 'PC'}]
  }, null, 2)

  uploadProducts() {
    if (this.payloadForm().valid()) {
      this.errorDetails.set([])
      this.productBulkUploadService.uploadProducts(
        parseJsonPayload<ProductBulkUploadRequest>(this.payloadFormValue().payload),
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
