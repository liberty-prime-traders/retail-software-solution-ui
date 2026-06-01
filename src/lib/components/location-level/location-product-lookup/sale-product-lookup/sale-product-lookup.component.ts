import {NgTemplateOutlet} from '@angular/common'
import {Component, inject} from '@angular/core'
import {PrimeTemplate} from 'primeng/api'
import {Select} from 'primeng/select'
import {ProductForSale} from '../../../../api/location-level/product-lookup/product-for-sale.model'
import {
  SaleProductLookupQuickSearchService
} from '../../../../api/location-level/product-lookup/sale-product-lookup-quick-search.service'
import {SaleProductLookupStore} from '../../../../api/location-level/product-lookup/sale-product-lookup.store'
import {PaginatedBaseService} from '../../../../api/util/paginated-api/paginated-base.service'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LocationProductLookupComponent} from '../location-product-lookup.component'
import {ProductLookupFilterService} from '../product-lookup-filter.service'
import {SaleProductLookupFilterService} from './sale-product-lookup-filter.service'

@Component({
  selector: 'rts-sale-product-lookup',
  templateUrl: '../location-product-lookup.component.html',
  providers: [
    SaleProductLookupQuickSearchService,
    SaleProductLookupStore,
    SaleProductLookupFilterService,
    {provide: PaginatedBaseService, useExisting: SaleProductLookupQuickSearchService},
    {provide: ProductLookupFilterService, useExisting: SaleProductLookupFilterService}
  ],
  imports: [
    FormFieldComponent,
    Select,
    PrimeTemplate,
    NgTemplateOutlet
  ]
})
export class SaleProductLookupComponent extends LocationProductLookupComponent<ProductForSale> {

  private readonly quickSearchService = inject(SaleProductLookupQuickSearchService)

  protected override fetchProducts(searchText: string, excludeIds: string[]) {
    return this.quickSearchService.fetchProducts(searchText, excludeIds)
  }
}
