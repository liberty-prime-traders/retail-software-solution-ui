import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {TaxRateService} from '../../../api/organization-level/tax-rate/tax-rate.service'
import {CalculationMethod} from '../../../api/platform-level/tax-type/calculation-method.enum'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {NewFormCancelButtonComponent} from '../../reusable/new-form-cancel-button.component'
import {TaxRateAddFormComponent} from './tax-rate-add-form/tax-rate-add-form.component'
import {TaxRateEditFormComponent} from './tax-rate-edit-form/tax-rate-edit-form.component'

@Component({
  selector: 'rts-tax-rate',
  templateUrl: 'tax-rate.component.html',
  imports: [
    NgClass,
    TableModule,
    NullSafePipe,
    Button,
    TaxRateAddFormComponent,
    TaxRateEditFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    AutoStretchDirective,
    NewFormCancelButtonComponent,
    CurrencyPipe,
  ]
})
export class TaxRateComponent extends GridWithAddButtonComponent<TaxRateService> {
  private readonly taxRateService = inject(TaxRateService)
  readonly apiService = this.taxRateService

  readonly taxRates = this.taxRateService.selectAll
  protected readonly CalculationMethod = CalculationMethod
}
