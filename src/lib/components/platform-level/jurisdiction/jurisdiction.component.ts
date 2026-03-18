import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {JurisdictionService} from '../../../api/platform-level/jurisdiction/jurisdiction.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {NewFormCancelButtonComponent} from '../../reusable/new-form-cancel-button.component'
import {JurisdictionFormComponent} from './jurisdiction-form/jurisdiction-form.component'

@Component({
  selector: 'rts-jurisdiction',
  templateUrl: 'jurisdiction.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    JurisdictionFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    AutoStretchDirective,
    NewFormCancelButtonComponent
  ]
})
export class JurisdictionComponent extends GridWithAddButtonComponent<JurisdictionService> {
  private readonly jurisdictionService = inject(JurisdictionService)
  readonly apiService = this.jurisdictionService

  readonly jurisdictions = this.jurisdictionService.selectAll
}
