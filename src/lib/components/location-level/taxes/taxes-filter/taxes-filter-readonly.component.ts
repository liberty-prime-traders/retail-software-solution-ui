import {DecimalPipe} from '@angular/common'
import {Component, inject, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Fieldset} from 'primeng/fieldset'
import {TruncatedListComponent} from '../../../reusable/truncated-list/truncated-list.component'
import {TaxesFilterState} from './taxes-filter.state'

@Component({
  selector: 'rts-taxes-filter-readonly',
  imports: [
    DecimalPipe,
    TruncatedListComponent,
    Fieldset,
    ButtonDirective
  ],
  templateUrl: 'taxes-filter-readonly.component.html'
})
export class TaxesFilterReadonlyComponent {
  readonly state = inject(TaxesFilterState)

  readonly editFilters = output()
}
