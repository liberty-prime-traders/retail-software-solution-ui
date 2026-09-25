import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, effect, EnvironmentInjector, inject, input, runInInjectionContext, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormControl, FormsModule} from '@angular/forms'
import {BlockUIModule} from 'primeng/blockui'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Message} from 'primeng/message'
import {TableModule} from 'primeng/table'
import {ProductDetail} from '../../../../api/cross-tier/product/product-detail.model'
import {ProductSearchParameters} from '../../../../api/cross-tier/product/product-search-parameters.model'
import {SchemaLevel} from '../../../../api/platform-level/table-registry/schema-level.enum'
import {UnitConversionGraphService} from '../../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {PaginatedBaseService} from '../../../../api/util/paginated-api/paginated-base.service'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {
  OpeningStockGridComponent
} from '../../../location-level/location-products/opening-stock/opening-stock-grid.component'
import {BulkProductImportComponent} from '../../../organization-level/products/bulk-product-import/bulk-product-import.component'
import {OrganizationProductFormComponent} from '../../../organization-level/products/product-form/organization-product-form.component'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {HasFilteredDataComponent} from '../../../reusable/has-filtered-data.component'
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
    ButtonDirective,
    BulkProductImportComponent,
    OrganizationProductFormComponent,
    ProductFilterComponent,
    SearchComponent,
    Message,
    NgClass,
    NgTemplateOutlet,
    ProductFilterComponent,
    ProductGridComponent,
    OpeningStockGridComponent,
    AutoStretchDirective
  ]
})
export class ProductGeneralComponent<PRODUCT extends ProductDetail> extends HasFilteredDataComponent {

  private readonly productFilterService = inject(ProductFilterService<PRODUCT>)
  protected readonly productSearchService = inject(PaginatedBaseService<PRODUCT, ProductSearchParameters>)
  private readonly environmentInjector = inject(EnvironmentInjector)
  readonly sessionContextService = inject(SessionContextService)

  protected override readonly applyFilters$ = this.productFilterService.applyFilters$
  readonly searchValueFormControl = this.productFilterService.filterForm.get('searchText')! as FormControl<string>
  private readonly advancedFilterApplied$ = this.productFilterService.advancedFilterInUse$
  readonly advancedFilterApplied = toSignal(this.advancedFilterApplied$, {initialValue: false})

  readonly SchemaLevel = SchemaLevel
  readonly schemaLevel = input.required<SchemaLevel>()

  readonly addingNewProductIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly showBulkImportScreen = signal(false)
  readonly openingStockEditMode = signal(false)

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

  showScreenThatAddsNewProduct() {
    this.addingNewProductIsActive.set(true)
  }

  hideScreenThatAddsNewProduct() {
    this.addingNewProductIsActive.set(false)
    this.productFilterService.reloadClientSideFilteredEntities()
  }

  toggleBulkImport() {
    this.showBulkImportScreen.set(!this.showBulkImportScreen())
  }

  toggleOpeningStockEditMode() {
    const enteringEditMode = !this.openingStockEditMode()
    this.openingStockEditMode.set(enteringEditMode)
    if (enteringEditMode) {
      runInInjectionContext(this.environmentInjector, () => inject(UnitConversionGraphService))
    }
  }

  finishBulkImport() {
    this.showBulkImportScreen.set(false)
    this.productFilterService.reloadClientSideFilteredEntities()
  }
}
