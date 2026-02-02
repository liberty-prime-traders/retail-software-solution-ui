import {Component} from '@angular/core'
import {
  LocationProductSearchService
} from '../../../api/location-level/location-product-search/location-product-search.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {PaginatedBaseService} from '../../../api/util/paginated-api/paginated-base.service'
import {ProductGeneralComponent} from '../../cross-tier/product/general-screen/product-general.component'
import {ProductFilterService} from '../../cross-tier/product/product-filter.service'
import {LocationProductFilterService} from './location-product-filter.service'

@Component({
  selector: 'rts-location-product',
  standalone: true,
  imports: [
    ProductGeneralComponent
  ],
  providers: [
    {provide: ProductFilterService, useClass: LocationProductFilterService},
    {provide: PaginatedBaseService, useClass: LocationProductSearchService}
  ],
  template: `<rts-product [schemaLevel]="SchemaLevel.LOCATION"></rts-product>`
})
export class LocationProductComponent {

  protected readonly SchemaLevel = SchemaLevel
}
