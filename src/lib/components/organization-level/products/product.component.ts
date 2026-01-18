import {NgClass} from '@angular/common'
import {Component, computed, inject, model, OnInit, signal} from '@angular/core'
import {toObservable, toSignal} from '@angular/core/rxjs-interop'
import {FormsModule} from '@angular/forms'
import {BlockUIModule} from 'primeng/blockui'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Message} from 'primeng/message'
import {TableModule} from 'primeng/table'
import {combineLatest, of, switchMap} from 'rxjs'
import {CategoryService} from '../../../api/organization-level/category/category.service'
import {ProductGroupService} from '../../../api/organization-level/product-group/product-group.service'
import {Product} from '../../../api/organization-level/product/product.model'
import {ProductService} from '../../../api/organization-level/product/product.service'
import {UnitValueService} from '../../../api/organization-level/unit-value/unitvalue.service'
import {debouncedSignal} from '../../../utils/signals'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {SearchComponent} from '../../reusable/search.component'
import {ProductDataService} from './product-data.servive'
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
    ProductFilterComponent,
    SearchComponent,
    Message,
    NgClass
  ]
})
export class ProductComponent extends HasSubscriptionComponent implements OnInit {

  private readonly productService = inject(ProductService)
  private readonly categoryService = inject(CategoryService)
  private readonly productGroupService = inject(ProductGroupService)
  private readonly unitValueService = inject(UnitValueService)
  readonly productDataService = inject(ProductDataService)

  readonly loading = computed(() =>
    this.productService.selectLoading()
    || this.categoryService.selectLoading()
    || this.productGroupService.selectLoading()
    || this.unitValueService.selectLoading()
  )

  readonly showAdvancedFilter = signal(false)
  readonly searchValue = model<string>('')
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly selectedProduct = model<Product|undefined>(undefined)

  private readonly debouncedSearchValue = debouncedSignal(this.searchValue, 1000)

  readonly advancedFilterApplied = toSignal(this.productDataService.advancedFilterApplied$, {initialValue: false})

  private readonly applyFilters$ = combineLatest([
    toObservable(this.debouncedSearchValue),
    this.productDataService.filterFormChanges$
  ]).pipe(
    switchMap(([searchText, _]) => of(this.productDataService.applyFilters(searchText)))
  ).subscribe()

  ngOnInit() {
    this.subscriptions.add(this.applyFilters$)
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
