import {Component, inject} from '@angular/core'
import {PrimeTemplate} from 'primeng/api'
import {Select} from 'primeng/select'
import {
  AvailableProductLookupQuickSearchService
} from '../../../../api/location-level/product-lookup/available-product-lookup-quick-search.service'
import {AvailableProductLookupStore} from '../../../../api/location-level/product-lookup/available-product-lookup.store'
import {ProductWithAvailability} from '../../../../api/location-level/product-lookup/product-with-availability.model'
import {PaginatedBaseService} from '../../../../api/util/paginated-api/paginated-base.service'
import {ProductLabelPipe} from '../../../../utils/pipes/product-label.pipe'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LocationProductLookupComponent} from '../location-product-lookup.component'
import {ProductLookupFilterService} from '../product-lookup-filter.service'
import {AvailableProductLookupFilterService} from './available-product-lookup-filter.service'

@Component({
  selector: 'rts-available-product-lookup',
  templateUrl: 'available-product-lookup.component.html',
  providers: [
    AvailableProductLookupQuickSearchService,
    AvailableProductLookupStore,
    AvailableProductLookupFilterService,
    {provide: PaginatedBaseService, useExisting: AvailableProductLookupQuickSearchService},
    {provide: ProductLookupFilterService, useExisting: AvailableProductLookupFilterService}
  ],
  imports: [
    FormFieldComponent,
    Select,
    ProductLabelPipe,
    PrimeTemplate
  ]
})
export class AvailableProductLookupComponent extends LocationProductLookupComponent<ProductWithAvailability> {

  private readonly quickSearchService = inject(AvailableProductLookupQuickSearchService)

  protected override fetchProducts(searchText: string, excludeIds: string[]) {
    return this.quickSearchService.fetchProducts(searchText, excludeIds)
  }
}
