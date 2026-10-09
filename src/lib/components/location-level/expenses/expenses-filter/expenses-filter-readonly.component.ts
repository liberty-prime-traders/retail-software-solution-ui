import {DecimalPipe} from '@angular/common'
import {Component, inject, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Fieldset} from 'primeng/fieldset'
import {OrgDateTimePipe} from '../../../../utils/pipes/org-date-time.pipe'
import {TruncatedListComponent} from '../../../reusable/truncated-list/truncated-list.component'
import {ExpensesFilterState} from './expenses-filter.state'

@Component({
  selector: 'rts-expenses-filter-readonly',
  imports: [
    OrgDateTimePipe,
    DecimalPipe,
    TruncatedListComponent,
    Fieldset,
    ButtonDirective
  ],
  templateUrl: 'expenses-filter-readonly.component.html'
})
export class ExpensesFilterReadonlyComponent {
  readonly state = inject(ExpensesFilterState)

  readonly editFilters = output()
}
