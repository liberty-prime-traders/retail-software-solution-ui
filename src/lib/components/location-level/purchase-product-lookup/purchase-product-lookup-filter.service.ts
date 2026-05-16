import {inject, Injectable} from '@angular/core'
import {PurchaseProductLookup} from '../../../api/cross-tier/product/purchase-product-lookup.model'
import {
  PurchaseProductLookupQuickSearchService
} from '../../../api/location-level/product-lookup/purchase-product-lookup-quick-search.service'
import {ProductLookupFilterService} from '../location-product-lookup/product-lookup-filter.service'

@Injectable()
export class PurchaseProductLookupFilterService extends ProductLookupFilterService<PurchaseProductLookup> {
  constructor() {
    super(inject(PurchaseProductLookupQuickSearchService))
  }
}
