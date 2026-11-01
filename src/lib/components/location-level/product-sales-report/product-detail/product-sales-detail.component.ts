import {Component, computed, effect, inject, model, signal, untracked} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {ActivatedRoute, Router, RouterLink} from '@angular/router'
import {Badge} from 'primeng/badge'
import {ButtonDirective} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {isEqual} from 'lodash-es'
import {
  ProductSalesLinesParameters
} from '../../../../api/location-level/product-sales-report/product-sales-lines-parameters.model'
import {
  ProductSalesSummaryParameters
} from '../../../../api/location-level/product-sales-report/product-sales-summary-parameters.model'
import {ProductSalesSummary} from '../../../../api/location-level/product-sales-report/product-sales-summary.model'
import {
  ProductSalesSummaryService
} from '../../../../api/location-level/product-sales-report/product-sales-summary.service'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {debouncedSignal} from '../../../../utils/signals'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {ProductSalesRangeFormDefinition} from '../shared/product-sales-range-form.definition'
import {ProductSalesReportState} from '../shared/product-sales-report.state'
import {ProductSalesFiguresComponent} from './product-sales-figures.component'
import {ProductSalesLinesGridComponent} from './product-sales-lines-grid.component'

@Component({
  selector: 'rts-product-sales-detail',
  templateUrl: 'product-sales-detail.component.html',
  imports: [
    RouterLink,
    ButtonDirective,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Badge,
    DatePicker,
    FormField,
    FormFieldComponent,
    ErrorSummaryComponent,
    LoadingContainerComponent,
    ProductSalesFiguresComponent,
    ProductSalesLinesGridComponent
  ]
})
export class ProductSalesDetailComponent {
  private readonly productSalesSummaryService = inject(ProductSalesSummaryService)
  private readonly zonedDatesService = inject(ZonedDatesService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly productSalesReportState = inject(ProductSalesReportState)

  readonly FormFieldLayout = FormFieldLayout
  readonly openedProduct = this.productSalesReportState.openedProduct
  readonly locationProductId = computed(() => this.openedProduct()?.locationProductId)

  readonly selectedTab = model<'summary' | 'lines'>('lines')

  readonly rangeFormValue = signal({...this.productSalesReportState.reportRange()})
  readonly rangeForm = form(this.rangeFormValue, ProductSalesRangeFormDefinition.productSalesRangeFormSchema)
  private readonly debouncedRangeFormValue = debouncedSignal(this.rangeFormValue, 800)

  readonly rangeErrors = computed(() => ProductSalesRangeFormDefinition.rangeErrors(this.debouncedRangeFormValue()))
  private readonly range = computed(() =>
    ProductSalesRangeFormDefinition.convertToRange(this.debouncedRangeFormValue(), this.zonedDatesService)
  )

  private readonly summariesForProduct = this.productSalesSummaryService.selectForGroup(this.locationProductId)
  readonly summary = computed((): ProductSalesSummary | undefined => this.summariesForProduct()[0])
  readonly errorMessages = computed(() =>
    this.rangeErrors().length ? this.rangeErrors() : this.productSalesSummaryService.selectFailureMessages()
  )
  readonly lineCount = computed(() => this.summary()?.lineCount ?? 0)
  private readonly summaryParameters = computed((): ProductSalesSummaryParameters | null => {
    const range = this.range()
    const locationProductId = this.locationProductId()
    return range && locationProductId ? {locationProductIds: [locationProductId], ...range} : null
  })
  private readonly requestedSummaryParameters = signal<ProductSalesSummaryParameters | null>(null)

  // The summary store keeps the previous range's figures until the response replaces them, so loading also covers
  // the debounce after an edit and the moment before the request is issued.
  readonly loading = computed(() =>
    this.productSalesSummaryService.selectLoading()
    || !isEqual(this.rangeFormValue(), this.debouncedRangeFormValue())
    || !isEqual(this.summaryParameters(), this.requestedSummaryParameters())
  )

  readonly linesParameters = computed((): ProductSalesLinesParameters | null => {
    const range = this.range()
    return range ? {...range} : null
  })

  readonly $loadSummaryOnParameterChange = effect(() => {
    const parameters = this.summaryParameters()
    untracked(() => {
      this.requestedSummaryParameters.set(parameters)
      if (parameters) {
        this.productSalesSummaryService.load(parameters)
      }
    })
  })

  readonly $leaveWhenNoProductIsOpen = effect(() => {
    if (!this.openedProduct()) {
      untracked(() => this.router.navigate(['..'], {relativeTo: this.activatedRoute}))
    }
  })
}
