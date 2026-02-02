import {Component} from '@angular/core'
import {
  OrganizationProductSearchService
} from '../../../api/organization-level/product-search/organization-product-search.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {PaginatedBaseService} from '../../../api/util/paginated-api/paginated-base.service'
import {ProductGeneralComponent} from '../../cross-tier/product/general-screen/product-general.component'
import {ProductFilterService} from '../../cross-tier/product/product-filter.service'
import {OrganizationProductFilterService} from './organization-product-filter.service'

@Component({
  selector: 'rts-location-product',
  standalone: true,
  imports: [
    ProductGeneralComponent
  ],
  providers: [
    {provide: ProductFilterService, useClass: OrganizationProductFilterService},
    {provide: PaginatedBaseService, useClass: OrganizationProductSearchService}
  ],
  template: `<rts-product [schemaLevel]="SchemaLevel.ORGANIZATION"></rts-product>`
})
export class OrganizationProductComponent {

  protected readonly SchemaLevel = SchemaLevel
}
