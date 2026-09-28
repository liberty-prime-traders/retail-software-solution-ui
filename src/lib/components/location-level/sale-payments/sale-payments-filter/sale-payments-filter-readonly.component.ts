import {DatePipe, DecimalPipe} from '@angular/common'
import {Component, inject, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Fieldset} from 'primeng/fieldset'
import {TruncatedListComponent} from '../../../reusable/truncated-list/truncated-list.component'
import {SalePaymentsFilterState} from './sale-payments-filter.state'

@Component({
  selector: 'rts-sale-payments-filter-readonly',
  imports: [
    DatePipe,
    DecimalPipe,
    TruncatedListComponent,
    Fieldset,
    ButtonDirective
  ],
  templateUrl: 'sale-payments-filter-readonly.component.html'
})
export class SalePaymentsFilterReadonlyComponent {
  readonly state = inject(SalePaymentsFilterState)

  readonly editFilters = output()
}
