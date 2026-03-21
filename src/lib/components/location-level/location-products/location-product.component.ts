import {Component} from '@angular/core'
import {provideLocationServices} from '../../../api/cross-tier/product/product-services-providers'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {ProductGeneralComponent} from '../../cross-tier/product/general-screen/product-general.component'

@Component({
  selector: 'rts-location-product',
  imports: [
    ProductGeneralComponent
  ],
  providers: provideLocationServices(),
  template: `<rts-product [schemaLevel]="SchemaLevel.LOCATION"></rts-product>`
})
export class LocationProductComponent {

  protected readonly SchemaLevel = SchemaLevel
}
