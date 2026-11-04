import {Component, inject} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {Chip} from 'primeng/chip'
import {DatePicker} from 'primeng/datepicker'
import {Fieldset} from 'primeng/fieldset'
import {Select} from 'primeng/select'
import {PurchaseProductLookupComponent} from '../../../location-product-lookup/purchase-product-lookup/purchase-product-lookup.component'
import {FormFieldLayout} from '../../../../reusable/form-field/form-field-layout'
import {ProductPurchasesReportFilterState} from './product-purchases-report-filter.state'

@Component({
  selector: 'rts-product-purchases-report-filter',
  templateUrl: 'product-purchases-report-filter.component.html',
  imports: [
    FormField,
    ButtonDirective,
    Chip,
    DatePicker,
    Fieldset,
    Select,
    PurchaseProductLookupComponent
  ]
})
export class ProductPurchasesReportFilterComponent {
  readonly filterState = inject(ProductPurchasesReportFilterState)
  readonly FormFieldLayout = FormFieldLayout
}
