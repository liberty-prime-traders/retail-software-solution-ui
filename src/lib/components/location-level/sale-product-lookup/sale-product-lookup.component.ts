import {Component, inject} from '@angular/core'
import {Select} from 'primeng/select'
import {SaleProductLookup} from '../../../api/cross-tier/product/sale-product-lookup.model'
import {
  SaleProductLookupQuickSearchService
} from '../../../api/location-level/product-lookup/sale-product-lookup-quick-search.service'
import {SaleProductLookupStore} from '../../../api/location-level/product-lookup/sale-product-lookup.store'
import {PaginatedBaseService} from '../../../api/util/paginated-api/paginated-base.service'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {LocationProductLookupComponent} from '../location-product-lookup/location-product-lookup.component'
import {ProductLookupFilterService} from '../location-product-lookup/product-lookup-filter.service'
import {SaleProductLookupFilterService} from './sale-product-lookup-filter.service'

@Component({
  selector: 'rts-sale-product-lookup',
  templateUrl: '../location-product-lookup/location-product-lookup.component.html',
  providers: [
    SaleProductLookupQuickSearchService,
    SaleProductLookupStore,
    SaleProductLookupFilterService,
    {provide: PaginatedBaseService, useExisting: SaleProductLookupQuickSearchService},
    {provide: ProductLookupFilterService, useExisting: SaleProductLookupFilterService}
  ],
  imports: [
    FormFieldComponent,
    Select
  ]
})
export class SaleProductLookupComponent extends LocationProductLookupComponent<SaleProductLookup> {

  private readonly quickSearchService = inject(SaleProductLookupQuickSearchService)

  protected override fetchProducts(searchText: string, excludeIds: string[]) {
    return this.quickSearchService.fetchProducts(searchText, excludeIds)
  }
}
