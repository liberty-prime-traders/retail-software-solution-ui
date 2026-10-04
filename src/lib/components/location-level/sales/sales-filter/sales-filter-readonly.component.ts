import {DecimalPipe} from '@angular/common'
import {Component, inject, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Fieldset} from 'primeng/fieldset'
import {OrgDateTimePipe} from '../../../../utils/pipes/org-date-time.pipe'
import {TruncatedListComponent} from '../../../reusable/truncated-list/truncated-list.component'
import {SalesFilterState} from './sales-filter.state'

@Component({
  selector: 'rts-sales-filter-readonly',
  imports: [
    OrgDateTimePipe,
    DecimalPipe,
    TruncatedListComponent,
    Fieldset,
    ButtonDirective
  ],
  templateUrl: 'sales-filter-readonly.component.html'
})
export class SalesFilterReadonlyComponent {
  readonly state = inject(SalesFilterState)

  readonly editFilters = output()
}
