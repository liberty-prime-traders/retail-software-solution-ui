import {Component, computed, inject, model, OnInit, signal} from '@angular/core'
import {Badge} from 'primeng/badge'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {ExpenseSearchResultService} from '../../../api/cross-tier/expense/expense-search-result.service'
import {ExpenseSearchSummaryService} from '../../../api/cross-tier/expense/expense-search-summary.service'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {ExpenseTypeService} from '../../../api/organization-level/expense-type/expense-type.service'
import {PaymentOptionService} from '../../../api/organization-level/payment-option/payment-option.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'
import {ExpenseBatchFormComponent} from './expense-batch-form/expense-batch-form.component'
import {ExpenseGridComponent} from './expense-grid/expense-grid.component'
import {ExpensesFilterComponent} from './expenses-filter/expenses-filter.component'
import {ExpensesFilterReadonlyComponent} from './expenses-filter/expenses-filter-readonly.component'
import {ExpensesFilterState} from './expenses-filter/expenses-filter.state'
import {ExpensesSummaryComponent} from './expenses-summary.component'

@Component({
  selector: 'rts-expenses',
  templateUrl: 'expenses.component.html',
  imports: [
    ButtonDirective,
    Divider,
    Tab,
    Tabs,
    TabList,
    Badge,
    TabPanels,
    TabPanel,
    AutoStretchDirective,
    LoadingContainerComponent,
    ExpenseGridComponent,
    ExpenseBatchFormComponent,
    ExpensesFilterComponent,
    ExpensesFilterReadonlyComponent,
    ExpensesSummaryComponent
  ]
})
export class ExpensesComponent implements OnInit {
  private readonly contactService = inject(ContactService)
  private readonly expenseTypeService = inject(ExpenseTypeService)
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly expenseSearchResultService = inject(ExpenseSearchResultService)
  private readonly expenseSearchSummaryService = inject(ExpenseSearchSummaryService)
  private readonly filterState = inject(ExpensesFilterState)

  readonly formIsVisible = signal(false)
  readonly expenseCount = this.expenseSearchSummaryService.expenseCount

  readonly selectedTab = model<'summary' | 'expenses'>('expenses')

  readonly loading = computed(() =>
    this.expenseSearchSummaryService.selectLoading()
      || this.contactService.selectLoading()
      || this.expenseTypeService.selectLoading()
      || this.paymentOptionService.selectLoading()
  )

  ngOnInit() {
    this.contactService.fetch()
    this.expenseTypeService.fetch()
    this.paymentOptionService.fetch()
    this.onSelectedTabChange(this.selectedTab())
  }

  onSelectedTabChange(tab?: string | number) {
    const selectedTab = tab as 'summary' | 'expenses'
    this.selectedTab.set(selectedTab)
    if (selectedTab === 'expenses') {
      this.expenseSearchResultService.refetch(this.filterState.filterParams())
    }
  }
}
