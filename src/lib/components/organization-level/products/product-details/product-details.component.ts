import {NgClass} from '@angular/common'
import {Component, inject, model, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {ProductStatus} from '../../../../api/organization-level/product/product-status.enum'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {ProductDataService} from '../product-data.servive'
import {ProductFormComponent} from '../product-form/product-form.component'

@Component({
  selector: 'rts-product-details',
  templateUrl: 'product-details.component.html',
  imports: [
    FormsModule,
    TableModule,
    NullSafePipe,
    Button,
    ProductFormComponent,
    NgClass,
    Tag
  ]
})
export class ProductDetailsComponent {
  readonly productDataService = inject(ProductDataService)

  readonly ProductStatus = ProductStatus
  readonly rowIsExpanded = signal<boolean>(false)
  readonly freeFormSearch = model<string>()
}
