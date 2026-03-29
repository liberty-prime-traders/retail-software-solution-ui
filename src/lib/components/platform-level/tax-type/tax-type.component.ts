import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {TaxTypeService} from '../../../api/platform-level/tax-type/tax-type.service'
import {JoinEnumPipe} from '../../../utils/pipes/join-enum.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {NewFormCancelButtonComponent} from '../../reusable/new-form-cancel-button.component'
import {TaxTypeFormComponent} from './tax-type-form/tax-type-form.component'

@Component({
  selector: 'rts-tax-type',
  templateUrl: 'tax-type.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    TaxTypeFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    AutoStretchDirective,
    JoinEnumPipe,
    PrettifyEnumPipe,
    NewFormCancelButtonComponent
  ]
})
export class TaxTypeComponent extends GridWithAddButtonComponent<TaxTypeService> {
  private readonly taxTypeService = inject(TaxTypeService)
  readonly apiService = this.taxTypeService

  readonly taxTypes = this.taxTypeService.selectAll
}
