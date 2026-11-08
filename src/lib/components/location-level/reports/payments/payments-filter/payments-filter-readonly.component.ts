import {DecimalPipe} from '@angular/common'
import {Component, inject, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Fieldset} from 'primeng/fieldset'
import {PrettifyEnumPipe} from '../../../../../utils/pipes/prettify-enum.pipe'
import {OrgDateTimePipe} from '../../../../../utils/pipes/org-date-time.pipe'
import {TruncatedListComponent} from '../../../../reusable/truncated-list/truncated-list.component'
import {PaymentsFilterState} from './payments-filter.state'

@Component({
  selector: 'rts-payments-filter-readonly',
  imports: [
    OrgDateTimePipe,
    PrettifyEnumPipe,
    DecimalPipe,
    TruncatedListComponent,
    Fieldset,
    ButtonDirective
  ],
  templateUrl: 'payments-filter-readonly.component.html'
})
export class PaymentsFilterReadonlyComponent {
  readonly state = inject(PaymentsFilterState)

  readonly editFilters = output()
}
