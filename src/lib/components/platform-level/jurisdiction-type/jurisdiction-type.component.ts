import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {JurisdictionTypeService} from '../../../api/platform-level/jurisdiction-type/jurisdiction-type.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {NewFormCancelButtonComponent} from '../../reusable/new-form-cancel-button.component'
import {JurisdictionTypeFormComponent} from './jurisdiction-type-form/jurisdiction-type-form.component'

@Component({
  selector: 'rts-jurisdiction-type',
  templateUrl: 'jurisdiction-type.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    JurisdictionTypeFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    ReactiveFormsModule,
    NgClass,
    AutoStretchDirective,
    NewFormCancelButtonComponent
  ]
})
export class JurisdictionTypeComponent extends GridWithAddButtonComponent<JurisdictionTypeService> {
  private readonly jurisdictionTypeService = inject(JurisdictionTypeService)
  readonly apiService = this.jurisdictionTypeService

  readonly jurisdictionTypes = this.jurisdictionTypeService.selectAll
}
