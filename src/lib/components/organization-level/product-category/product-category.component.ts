import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {ProductCategoryService} from '../../../api/organization-level/product-category/product-category.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {ProductCategoryFormComponent} from './product-category-form/product-category-form.component'

@Component({
  selector: 'rts-product-category',
  templateUrl: 'product-category.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    ProductCategoryFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    ReactiveFormsModule,
    NgClass
  ]
})
export class ProductCategoryComponent extends GridWithAddButtonComponent<ProductCategoryService> {
  private readonly productCategoryService = inject(ProductCategoryService)
  readonly apiService = this.productCategoryService

  readonly productCategories = this.productCategoryService.selectAll

  setAddingActiveTrue() {
    this.addingIsActive.set(true)
  }

  setAddingActiveFalse() {
    this.addingIsActive.set(false)
  }

  successfulSave() {
    this.setAddingActiveFalse()
  }
}
