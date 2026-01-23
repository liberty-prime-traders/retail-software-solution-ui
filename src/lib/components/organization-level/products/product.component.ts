import {NgClass} from '@angular/common'
import {Component, computed, inject, model, OnInit, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormControl, FormsModule} from '@angular/forms'
import {BlockUIModule} from 'primeng/blockui'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Message} from 'primeng/message'
import {TableModule} from 'primeng/table'
import {ProductCategoryService} from '../../../api/organization-level/product-category/product-category.service'
import {ProductGroupService} from '../../../api/organization-level/product-group/product-group.service'
import {Product} from '../../../api/organization-level/product/product.model'
import {ProductService} from '../../../api/organization-level/product/product.service'
import {UnitValueService} from '../../../api/organization-level/unit-value/unitvalue.service'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {SearchComponent} from '../../reusable/search.component'
import {ProductDetailsComponent} from './product-details/product-details.component'
import {ProductFilterComponent} from './product-filter/product-filter.component'
import {ProductFilterService} from './product-filter/product-filter.service'
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
    ProductFilterComponent,
    SearchComponent,
    Message,
    NgClass
  ]
})
export class ProductComponent extends HasSubscriptionComponent implements OnInit {

  private readonly productService = inject(ProductService)
  private readonly productCategoryService = inject(ProductCategoryService)
  private readonly productGroupService = inject(ProductGroupService)
  private readonly unitValueService = inject(UnitValueService)
  readonly productFilterService = inject(ProductFilterService)

  readonly searchValueFormControl = this.productFilterService.filterForm.get('searchText')! as FormControl<string>

  readonly loading = computed(() =>
    this.productService.selectLoading()
    || this.productCategoryService.selectLoading()
    || this.productGroupService.selectLoading()
    || this.unitValueService.selectLoading()
  )

  readonly showAdvancedFilter = signal(false)
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly selectedProduct = model<Product|undefined>(undefined)

  readonly advancedFilterApplied = toSignal(this.productFilterService.advancedFilterApplied$, {initialValue: false})

  ngOnInit() {
    this.subscriptions.add(this.productFilterService.applyFilters$.subscribe())
  }

  setAddingActiveTrue() {
    this.addingIsActive.set(true)
  }

  setAddingActiveFalse() {
    this.addingIsActive.set(false)
  }

  toggleAdvancedFilter(show: boolean) {
    this.showAdvancedFilter.set(show)
  }
}
