import {CurrencyPipe, DecimalPipe, NgClass} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Panel} from 'primeng/panel'
import {Table, RowToggler} from 'primeng/table'
import {ProductPurchasesReportService} from '../../../../api/location-level/product-purchases-report/product-purchases-report.service'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {ProductPurchasesReportFilterState} from './report-filter/product-purchases-report-filter.state'
import {ProductPurchasesReportFilterComponent} from './report-filter/product-purchases-report-filter.component'
import {ProductDeliveryLinesGridComponent} from './delivery-lines/product-delivery-lines-grid.component'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-product-purchases-report',
  templateUrl: 'product-purchases-report.component.html',
  providers: [ProductPurchasesReportFilterState],
  imports: [
    Table,
    RowToggler,
    Panel,
    CurrencyPipe,
    DecimalPipe,
    EmptyRowComponent,
    ProductPurchasesReportFilterComponent,
    ProductDeliveryLinesGridComponent,
    Divider,
    ButtonDirective,
    AutoStretchDirective,
    NgClass
  ]
})
export class ProductPurchasesReportComponent {
  private readonly productPurchasesReportService = inject(ProductPurchasesReportService)

  readonly filterState = inject(ProductPurchasesReportFilterState)

  readonly rows = this.productPurchasesReportService.selectAll
  readonly loading = this.productPurchasesReportService.selectLoading
  readonly productCount = this.productPurchasesReportService.selectCount
  readonly totalCost = computed(() => this.rows().reduce((total, row) => total + row.totalCost, 0))
  readonly deliveryLineCount = computed(() => this.rows().reduce((count, row) => count + row.deliveryLineCount, 0))

}
