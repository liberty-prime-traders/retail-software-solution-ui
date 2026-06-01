import {inject, Injectable} from '@angular/core'
import {ProductForPurchase} from '../../../../api/location-level/product-lookup/product-for-purchase.model'
import {
  PurchaseProductLookupQuickSearchService
} from '../../../../api/location-level/product-lookup/purchase-product-lookup-quick-search.service'
import {ProductLookupFilterService} from '../product-lookup-filter.service'

@Injectable()
export class PurchaseProductLookupFilterService extends ProductLookupFilterService<ProductForPurchase> {
  constructor() {
    super(inject(PurchaseProductLookupQuickSearchService))
  }
}
