import {inject, Injectable} from '@angular/core'
import {
  SaleProductLookupQuickSearchService
} from '../../../api/location-level/product-lookup/sale-product-lookup-quick-search.service'
import {SaleProductLookup} from '../../../api/cross-tier/product/sale-product-lookup.model'
import {ProductLookupFilterService} from '../location-product-lookup/product-lookup-filter.service'

@Injectable()
export class SaleProductLookupFilterService extends ProductLookupFilterService<SaleProductLookup> {
  constructor() {
    super(inject(SaleProductLookupQuickSearchService))
  }
}
