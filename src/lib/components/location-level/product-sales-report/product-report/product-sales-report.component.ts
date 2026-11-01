import {CurrencyPipe, DatePipe, NgTemplateOutlet} from '@angular/common'
import {Component, computed, effect, inject, signal, untracked, viewChild} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {ButtonDirective} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {InputText} from 'primeng/inputtext'
import {Panel} from 'primeng/panel'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableCheckbox, TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {
  ProductSalesReportSearchService
} from '../../../../api/location-level/product-sales-report/product-sales-report-search.service'
import {
  ProductSalesSortDirection
} from '../../../../api/location-level/product-sales-report/product-sales-sort-direction.enum'
import {
  ProductSalesSortField
} from '../../../../api/location-level/product-sales-report/product-sales-sort-field.enum'
import {loadNextOnLazyLoad} from '../../../../api/util/paginated-api/paginated-lazy-load.util'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {resetVirtualScrollOnSearch} from '../../../../utils/primeng-table.util'
import {debouncedSignal} from '../../../../utils/signals'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {PercentFigurePipe} from '../shared/percent-figure.pipe'
import {ProductSalesRangeFormDefinition} from '../shared/product-sales-range-form.definition'
import {ProductSalesProduct, ProductSalesReportState} from '../shared/product-sales-report.state'
import {
  DEFAULT_PRODUCT_REPORT_SORT,
  filterProductReportRows,
  nextProductReportSort,
  ProductReportSort,
  sortProductReportRows
} from './product-report-view'
import {ProductSelectionLockedPipe} from './product-selection-locked.pipe'

const SEARCH_DEBOUNCE_IN_MS = 500
const RANGE_DEBOUNCE_IN_MS = 800

@Component({
  selector: 'rts-product-sales-report',
  templateUrl: 'product-sales-report.component.html',
  imports: [
    TableModule,
    TableCheckbox,
    Skeleton,
    Tag,
    InputText,
    DatePicker,
    ButtonDirective,
    FormField,
    ErrorSummaryComponent,
    LoadingContainerComponent,
    EmptyRowComponent,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    NullishToZeroPipe,
    PercentFigurePipe,
    ProductSelectionLockedPipe,
    NgTemplateOutlet,
    AutoStretchDirective,
    FormFieldComponent,
    Panel
  ]
})
export class ProductSalesReportComponent {
  private readonly productSalesReportSearchService = inject(ProductSalesReportSearchService)
  private readonly productSalesReportState = inject(ProductSalesReportState)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)

  readonly ProductSalesSortField = ProductSalesSortField
  readonly FormFieldLayout = FormFieldLayout
  readonly maxCompareProducts = ProductSalesReportState.MAX_COMPARED_PRODUCTS
  readonly highMarginPercent = 10

  readonly rangeFormValue = this.productSalesReportState.reportRange
  readonly rangeForm = form(this.rangeFormValue, ProductSalesRangeFormDefinition.productSalesRangeFormSchema)
  private readonly debouncedRangeFormValue = debouncedSignal(this.rangeFormValue, RANGE_DEBOUNCE_IN_MS)
  private readonly dates = computed(() =>
    ProductSalesRangeFormDefinition.convertToDates(this.debouncedRangeFormValue())
  )
  private readonly rangeErrors = computed(() =>
    ProductSalesRangeFormDefinition.rangeErrors(this.debouncedRangeFormValue())
  )

  readonly searchFormValue = signal({searchText: ''})
  readonly searchForm = form(this.searchFormValue)
  private readonly debouncedSearchText = debouncedSignal(
    computed(() => this.searchFormValue().searchText), SEARCH_DEBOUNCE_IN_MS
  )

  private readonly sort = signal<ProductReportSort>(DEFAULT_PRODUCT_REPORT_SORT)
  private readonly table = viewChild(Table)

  readonly requireClientSideFilter = this.productSalesReportSearchService.requireClientSideFilter
  readonly snapshotBuiltAt = this.productSalesReportSearchService.snapshotBuiltAt
  readonly loading = this.productSalesReportSearchService.selectLoading
  readonly failureMessages = computed(() =>
    this.rangeErrors().length ? this.rangeErrors() : this.productSalesReportSearchService.selectFailureMessages()
  )

  readonly selectedProducts = this.productSalesReportState.comparedProducts
  readonly selectedNames = computed(() => this.selectedProducts().map(product => product.productName).join(', '))

  readonly visibleRows = computed(() => {
    const rows = this.productSalesReportSearchService.selectAll()
    if (!this.requireClientSideFilter()) {
      return rows
    }
    return sortProductReportRows(
      filterProductReportRows(rows.filter(row => !row.placeholder), this.debouncedSearchText()),
      this.sort()
    )
  })

  readonly loadedRowCount = computed(() => this.visibleRows().filter(row => !row.placeholder).length)

  readonly sortIcons = computed(() => {
    const {sortField: activeSortField, sortDirection} = this.sort()
    const directionIcon = sortDirection === ProductSalesSortDirection.ASC
      ? 'pi pi-sort-amount-up-alt'
      : 'pi pi-sort-amount-down'
    return Object.values(ProductSalesSortField).reduce(
      (icons, sortField) => ({...icons, [sortField]: sortField === activeSortField ? directionIcon : 'pi pi-sort-alt'}),
      {} as Record<string, string>
    )
  })

  // In client-side mode the search text and the sort never reach the server, so changing them leaves the
  // parameters unchanged and does not refetch; the range always does.
  readonly $searchOnParameterChange = effect(() => {
    const dates = this.dates()
    const searchText = this.debouncedSearchText()
    const sort = this.sort()
    untracked(() => {
      if (!dates) {
        return
      }
      const clientSideFilter = this.requireClientSideFilter()
      this.productSalesReportSearchService.refetch({
        ...dates,
        searchText: clientSideFilter ? undefined : searchText || undefined,
        ...(clientSideFilter ? DEFAULT_PRODUCT_REPORT_SORT : sort)
      })
    })
  })

  readonly $resetScrollOnFreshLoad = effect(() => {
    this.productSalesReportSearchService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  sortByColumn(sortField: ProductSalesSortField): void {
    this.sort.update(sort => nextProductReportSort(sort, sortField))
  }

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextOnLazyLoad(this.productSalesReportSearchService, lazyLoadEvent.last)
  }

  openProduct(product: ProductSalesProduct): void {
    this.productSalesReportState.openProduct(product)
  }

  clearSelection(): void {
    this.productSalesReportState.clearComparedProducts()
  }

  compareSelected(): void {
    this.router.navigate(['compare'], {relativeTo: this.activatedRoute})
  }
}
