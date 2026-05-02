import {Component, inject, OnInit, output} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Select} from 'primeng/select'
import {ToggleButton} from 'primeng/togglebutton'
import {LocationProduct} from '../../../../api/location-level/location-product/location-product.model'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {LocationProductLookupComponent} from '../../location-product-lookup/location-product-lookup.component'
import {SalePaymentSummaryComponent} from '../sale-payment-summary/sale-payment-summary.component'

@Component({
  selector: 'rts-new-sale',
  templateUrl: 'sale-form.component.html',
  imports: [
    Button,
    Card,
    FormFieldComponent,
    Select,
    ToggleButton,
    LocationProductLookupComponent,
    SalePaymentSummaryComponent
  ]
})
export class SaleFormComponent extends HasSubscriptionComponent implements OnInit{
  readonly hideSaleForm = output()

  private readonly contactService = inject(ContactService)

  private readonly WALK_IN_CUSTOMER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

  readonly customers = this.contactService.customers

  ngOnInit() {
    this.contactService.fetch()
  }

  addSaleLine(locationProduct: LocationProduct) {

  }
}
