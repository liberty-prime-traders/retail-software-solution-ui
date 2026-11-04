import {CurrencyPipe, DecimalPipe} from '@angular/common'
import {Component, computed, effect, inject, signal, untracked} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {RouterLink} from '@angular/router'
import {isEqual} from 'lodash-es'
import {ButtonDirective} from 'primeng/button'
import {Chip} from 'primeng/chip'
import {DatePicker} from 'primeng/datepicker'
import {ProductWithAvailability} from '../../../../../api/location-level/product-lookup/product-with-availability.model'
import {
  ProductSalesSummaryParameters
} from '../../../../../api/location-level/product-sales-report/product-sales-summary-parameters.model'
import {ProductSalesSummary} from '../../../../../api/location-level/product-sales-report/product-sales-summary.model'
import {
  ProductSalesSummaryService
} from '../../../../../api/location-level/product-sales-report/product-sales-summary.service'
import {ZonedDatesService} from '../../../../../utils/services/zoned-dates.service'
import {debouncedSignal} from '../../../../../utils/signals'
import {ErrorSummaryComponent} from '../../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../../reusable/loading-container/loading-container.component'
import {
  AvailableProductLookupComponent
} from '../../../location-product-lookup/available-product-lookup/available-product-lookup.component'
import {GrossSalesSplitComponent} from '../shared/gross-sales-split.component'
import {ProductSalesRangeFormDefinition} from '../shared/product-sales-range-form.definition'
import {ProductSalesReportState} from '../shared/product-sales-report.state'
import {COMPARE_ROWS, CompareFormat} from './product-compare-rows'
import {NullSafePipe} from '../../../../../utils/pipes/null-safe.pipe'
import {PercentFigurePipe} from '../shared/percent-figure.pipe'

@Component({
  selector: 'rts-product-sales-compare',
  templateUrl: 'product-sales-compare.component.html',
  styleUrl: 'product-sales-compare.component.scss',
  imports: [
    RouterLink,
    ButtonDirective,
    Chip,
    DatePicker,
    FormField,
    FormFieldComponent,
    ErrorSummaryComponent,
    LoadingContainerComponent,
    AvailableProductLookupComponent,
    GrossSalesSplitComponent,
    CurrencyPipe,
    DecimalPipe,
    NullSafePipe,
    PercentFigurePipe
  ]
})
export class ProductSalesCompareComponent {
  private readonly productSalesSummaryService = inject(ProductSalesSummaryService)
  private readonly zonedDatesService = inject(ZonedDatesService)
  private readonly productSalesReportState = inject(ProductSalesReportState)

  readonly CompareFormat = CompareFormat
  readonly FormFieldLayout = FormFieldLayout

  private readonly selectedProductIds = this.productSalesReportState.comparedProductIds
  readonly rangeFormValue = signal({...this.productSalesReportState.reportRange()})
  readonly rangeForm = form(this.rangeFormValue, ProductSalesRangeFormDefinition.productSalesRangeFormSchema)
  private readonly debouncedRangeFormValue = debouncedSignal(this.rangeFormValue, 800)

  readonly canAddProduct = this.productSalesReportState.canCompareMoreProducts
  readonly selectedIds = this.selectedProductIds
  private readonly requestedSummaryParameters = signal<ProductSalesSummaryParameters | null>(null)

  private readonly range = computed(() =>
    ProductSalesRangeFormDefinition.convertToRange(this.debouncedRangeFormValue(), this.zonedDatesService)
  )

  readonly summaries = computed(() => {
    const summariesByProductId = this.productSalesSummaryService.selectAllAsMap()
    return this.selectedProductIds()
      .map(productId => summariesByProductId.get(productId)?.[0])
      .filter((summary): summary is ProductSalesSummary => !!summary)
  })

  readonly chips = computed(() => this.productSalesReportState.comparedProducts().map(product => ({
    id: product.locationProductId,
    name: product.productName
  })))

  readonly matrix = computed(() => COMPARE_ROWS.map(row => ({
    row,
    cells: this.summaries().map(summary => {
      const value = summary[row.field] as number | null
      return row.nullAsZero ? value ?? 0 : value
    })
  })))

  readonly rangeErrors = computed(() => ProductSalesRangeFormDefinition.rangeErrors(this.debouncedRangeFormValue()))
  private readonly summaryParameters = computed((): ProductSalesSummaryParameters | null => {
    const range = this.range()
    const locationProductIds = this.selectedProductIds()
    return range && locationProductIds.length > 0 ? {locationProductIds, ...range} : null
  })

  // The summary store keeps the previous range's figures until the response replaces them, so loading also covers
  // the debounce after an edit and the moment before the request is issued.
  readonly loading = computed(() =>
    this.productSalesSummaryService.selectLoading()
    || !isEqual(this.rangeFormValue(), this.debouncedRangeFormValue())
    || !isEqual(this.summaryParameters(), this.requestedSummaryParameters())
  )
  readonly errorMessages = computed(() =>
    this.rangeErrors().length ? this.rangeErrors() : this.productSalesSummaryService.selectFailureMessages()
  )

  readonly $loadSummariesOnParameterChange = effect(() => {
    const parameters = this.summaryParameters()
    untracked(() => {
      this.requestedSummaryParameters.set(parameters)
      if (parameters) {
        this.productSalesSummaryService.load(parameters)
      }
    })
  })

  addProduct(product: ProductWithAvailability): void {
    this.productSalesReportState.addComparedProduct({
      locationProductId: String(product.id),
      productName: product.productName,
      productGroupName: product.productGroupName
    })
  }

  removeProduct(productId: string): void {
    this.productSalesReportState.removeComparedProduct(productId)
  }
}
