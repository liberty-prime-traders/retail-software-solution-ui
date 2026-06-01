import {NgTemplateOutlet} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Select} from 'primeng/select'
import {ProductForPurchase} from '../../../../api/location-level/product-lookup/product-for-purchase.model'
import {
  PurchaseProductLookupQuickSearchService
} from '../../../../api/location-level/product-lookup/purchase-product-lookup-quick-search.service'
import {
  PurchaseProductLookupStore
} from '../../../../api/location-level/product-lookup/purchase-product-lookup.store'
import {PaginatedBaseService} from '../../../../api/util/paginated-api/paginated-base.service'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LocationProductLookupComponent} from '../location-product-lookup.component'
import {ProductLookupFilterService} from '../product-lookup-filter.service'
import {PurchaseProductLookupFilterService} from './purchase-product-lookup-filter.service'

@Component({
  selector: 'rts-purchase-product-lookup',
  templateUrl: '../location-product-lookup.component.html',
  providers: [
    PurchaseProductLookupQuickSearchService,
    PurchaseProductLookupStore,
    PurchaseProductLookupFilterService,
    {provide: PaginatedBaseService, useExisting: PurchaseProductLookupQuickSearchService},
    {provide: ProductLookupFilterService, useExisting: PurchaseProductLookupFilterService}
  ],
  imports: [
    FormFieldComponent,
    Select,
    NgTemplateOutlet
  ]
})
export class PurchaseProductLookupComponent extends LocationProductLookupComponent<ProductForPurchase> {

  private readonly quickSearchService = inject(PurchaseProductLookupQuickSearchService)

  protected override fetchProducts(searchText: string, excludeIds: string[]) {
    return this.quickSearchService.fetchProducts(searchText, excludeIds)
  }
}
