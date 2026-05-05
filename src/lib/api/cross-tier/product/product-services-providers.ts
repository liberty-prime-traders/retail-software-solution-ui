import {Provider} from '@angular/core'
import {ProductFilterService} from '../../../components/cross-tier/product/product-filter.service'
import {
  LocationProductFilterService
} from '../../../components/location-level/location-products/location-product-filter.service'
import {
  OrganizationProductFilterService
} from '../../../components/organization-level/products/organization-product-filter.service'
import {
  LocationProductPaginatedSearchService
} from '../../location-level/location-product/location-product-paginated-search.service'
import {OrganizationProductSearchService} from '../../organization-level/product/organization-product-search.service'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'

export const provideLocationServices = (): Provider[] => [
  {provide: PaginatedBaseService, useExisting: LocationProductPaginatedSearchService},
  {provide: ProductFilterService, useExisting: LocationProductFilterService}
]

export const provideOrganizationServices = (): Provider[] => [
  {provide: ProductFilterService, useExisting: OrganizationProductFilterService},
  {provide: PaginatedBaseService, useExisting: OrganizationProductSearchService}
]
