import {NgClass} from '@angular/common'
import {Component, computed, effect, inject, input, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormControl, FormsModule} from '@angular/forms'
import {BlockUIModule} from 'primeng/blockui'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Message} from 'primeng/message'
import {TableModule} from 'primeng/table'
import {BaseProduct} from '../../../../api/cross-tier/product/base-product.model'
import {ProductSearchParameters} from '../../../../api/cross-tier/product/product-search-parameters.model'
import {SchemaLevel} from '../../../../api/platform-level/table-registry/schema-level.enum'
import {PaginatedBaseService} from '../../../../api/util/paginated-api/paginated-base.service'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {OrganizationProductFormComponent} from '../../../organization-level/products/product-form/organization-product-form.component'
import {BaseFilteredListComponent} from '../../../reusable/base-filtered-list.component'
import {SearchComponent} from '../../../reusable/search.component'
import {ProductFilterComponent} from '../filter-screen/product-filter.component'
import {ProductFilterService} from '../product-filter.service'
import {ProductGridComponent} from '../product-grid/product-grid.component'

@Component({
  selector: 'rts-product',
  templateUrl: 'product-general.component.html',
  imports: [
    TableModule,
    Divider,
    BlockUIModule,
    FormsModule,
    Button,
    OrganizationProductFormComponent,
    ProductFilterComponent,
    SearchComponent,
    Message,
    NgClass,
    ProductFilterComponent,
    ProductGridComponent
  ]
})
export class ProductGeneralComponent<PRODUCT extends BaseProduct> extends BaseFilteredListComponent {

  private readonly productFilterService = inject(ProductFilterService<PRODUCT>)
  protected readonly productSearchService = inject(PaginatedBaseService<PRODUCT, ProductSearchParameters>)
  readonly sessionContextService = inject(SessionContextService)

  protected override readonly applyFilters$ = this.productFilterService.applyFilters$
  readonly searchValueFormControl = this.productFilterService.filterForm.get('searchText')! as FormControl<string>
  private readonly advancedFilterApplied$ = this.productFilterService.advancedFilterInUse$
  readonly advancedFilterApplied = toSignal(this.advancedFilterApplied$, {initialValue: false})

  readonly SchemaLevel = SchemaLevel
  readonly schemaLevel = input.required<SchemaLevel>()

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)

  readonly $initializeClientSideFilter = effect(() => {
    if (this.productSearchService.requireClientSideFilter()) {
      this.productFilterService.reloadClientSideFilteredEntities()
    }
  })

  readonly locationName = computed(() =>
    this.sessionContextService.selectedLocation()?.name ?? ''
  )

  readonly organizationName = computed(() =>
    this.sessionContextService.selectedOrganization()?.name ?? ''
  )

  setAddingActiveTrue() {
    this.addingIsActive.set(true)
  }

  setAddingActiveFalse() {
    this.addingIsActive.set(false)
  }
}
