import {NgClass} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {AccountService} from '../../../api/organization-level/chart-of-accounts/account.service'
import {ExpenseTypeService} from '../../../api/organization-level/expense-type/expense-type.service'
import {BooleanToTextPipe} from '../../../utils/pipes/boolean-to-text.pipe'
import {JoinEnumPipe} from '../../../utils/pipes/join-enum.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {ExpenseTypeFormComponent} from './expense-type-form/expense-type-form.component'

@Component({
  selector: 'rts-expense-type',
  templateUrl: 'expense-type.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    JoinEnumPipe,
    BooleanToTextPipe,
    ButtonDirective,
    ExpenseTypeFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    AutoStretchDirective
  ]
})
export class ExpenseTypeComponent extends GridWithAddButtonComponent<ExpenseTypeService> {
  private readonly expenseTypeService = inject(ExpenseTypeService)
  private readonly accountService = inject(AccountService)
  readonly apiService = this.expenseTypeService

  readonly expenseTypes = computed(() => {
    const accountNames = new Map(this.accountService.selectAll().map(account => [account.code, account.displayName]))
    return this.expenseTypeService.selectAll().map(expenseType => ({
      ...expenseType,
      expenseAccountName: accountNames.get(expenseType.expenseAccountCode) ?? expenseType.expenseAccountCode
    }))
  })

  override ngOnInit() {
    super.ngOnInit()
    this.accountService.fetch()
  }
}
