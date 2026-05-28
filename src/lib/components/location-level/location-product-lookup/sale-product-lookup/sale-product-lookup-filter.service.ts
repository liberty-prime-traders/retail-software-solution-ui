import {inject, Injectable} from '@angular/core'
import {
  SaleProductLookupQuickSearchService
} from '../../../../api/location-level/product-lookup/sale-product-lookup-quick-search.service'
import {ProductForSale} from '../../../../api/location-level/product-lookup/product-for-sale.model'
import {ProductLookupFilterService} from '../product-lookup-filter.service'

@Injectable()
export class SaleProductLookupFilterService extends ProductLookupFilterService<ProductForSale> {
  constructor() {
    super(inject(SaleProductLookupQuickSearchService))
  }
}
