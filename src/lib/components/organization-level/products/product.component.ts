import {Component, computed, inject, model, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {BlockUIModule} from 'primeng/blockui'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {CategoryService} from '../../../api/organization-level/category/category.service'
import {Product} from '../../../api/organization-level/product/product.model'
import {ProductService} from '../../../api/organization-level/product/product.service'
import {UnitValueService} from '../../../api/organization-level/unit-value/unitvalue.service'
import {BaseGridComponent} from '../../reusable/base-grid.component'
import {ProductDetailsComponent} from './product-details/product-details.component'
import {ProductFilterComponent} from './product-filter/product-filter.component'
import {ProductFormComponent} from './product-form/product-form.component'

@Component({
  selector: 'rts-product',
  templateUrl: 'product.component.html',
  standalone: true,
  imports: [
    TableModule,
    Divider,
    BlockUIModule,
    ProductDetailsComponent,
    FormsModule,
    Button,
    ProductFormComponent,
    ProductFilterComponent
  ]
})
export class ProductComponent extends BaseGridComponent<ProductService> {

  private readonly productService = inject(ProductService)
  private readonly categoryService = inject(CategoryService)
  private readonly unitValueService = inject(UnitValueService)
  protected override apiService: ProductService = this.productService

  override readonly loading = computed(() =>
    this.productService.selectLoading()
    || this.categoryService.selectLoading()
    || this.unitValueService.selectLoading()
  )

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly selectedProduct = model<Product|undefined>(undefined)

  setAddingActiveTrue() {
    this.addingIsActive.set(true)
  }

  setAddingActiveFalse() {
    this.addingIsActive.set(false)
  }
}
