import {NgClass} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {
  StockMovementReasonService
} from '../../../api/organization-level/stock-movement-reason/stock-movement-reason.service'
import {BooleanToTextPipe} from '../../../utils/pipes/boolean-to-text.pipe'
import {JoinEnumPipe} from '../../../utils/pipes/join-enum.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {StockMovementReasonFormComponent} from './stock-movement-reason-form/stock-movement-reason-form.component'

@Component({
  selector: 'rts-stock-movement-reason',
  templateUrl: 'stock-movement-reason.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    JoinEnumPipe,
    BooleanToTextPipe,
    ButtonDirective,
    StockMovementReasonFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass
  ]
})
export class StockMovementReasonComponent extends GridWithAddButtonComponent<StockMovementReasonService> {
  readonly apiService = inject(StockMovementReasonService)
  readonly stockMovementReasons = computed(() => this.apiService.selectAll())
}
