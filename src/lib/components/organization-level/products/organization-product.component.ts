import {Component} from '@angular/core'
import {provideOrganizationServices} from '../../../api/cross-tier/product/product-services-providers'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {ProductGeneralComponent} from '../../cross-tier/product/general-screen/product-general.component'

@Component({
  selector: 'rts-organization-product',
  standalone: true,
  imports: [
    ProductGeneralComponent
  ],
  providers: provideOrganizationServices(),
  template: `<rts-product [schemaLevel]="SchemaLevel.ORGANIZATION"></rts-product>`
})
export class OrganizationProductComponent {

  protected readonly SchemaLevel = SchemaLevel
}
