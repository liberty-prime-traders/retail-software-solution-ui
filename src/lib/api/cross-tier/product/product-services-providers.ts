import {Provider} from '@angular/core'
import {ProductFilterService} from '../../../components/cross-tier/product/product-filter.service'
import {
  LocationProductFilterService
} from '../../../components/location-level/location-products/location-product-filter.service'
import {
  OrganizationProductFilterService
} from '../../../components/organization-level/products/organization-product-filter.service'
import {
  LocationProductSearchService
} from '../../location-level/location-product-search/location-product-search.service'
import {
  OrganizationProductSearchService
} from '../../organization-level/product-search/organization-product-search.service'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'

export const provideLocationServices = (): Provider[] => [
  LocationProductSearchService,
  LocationProductFilterService,
  {provide: ProductFilterService, useExisting: LocationProductFilterService},
  {provide: PaginatedBaseService, useExisting: LocationProductSearchService}
]

export const provideOrganizationServices = (): Provider[] => [
  OrganizationProductSearchService,
  OrganizationProductFilterService,
  {provide: ProductFilterService, useExisting: OrganizationProductFilterService},
  {provide: PaginatedBaseService, useExisting: OrganizationProductSearchService}
]
