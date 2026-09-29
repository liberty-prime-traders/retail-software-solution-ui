import {DatePipe, DecimalPipe} from '@angular/common'
import {Component, inject, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Fieldset} from 'primeng/fieldset'
import {TruncatedListComponent} from '../../../reusable/truncated-list/truncated-list.component'
import {PurchasesFilterState} from './purchases-filter.state'

@Component({
  selector: 'rts-purchases-filter-readonly',
  imports: [
    DatePipe,
    DecimalPipe,
    TruncatedListComponent,
    Fieldset,
    ButtonDirective
  ],
  templateUrl: 'purchases-filter-readonly.component.html'
})
export class PurchasesFilterReadonlyComponent {
  readonly state = inject(PurchasesFilterState)

  readonly editFilters = output()
}
