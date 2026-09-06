import {NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MarkdownComponent} from 'ngx-markdown'
import {ButtonModule} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {TreeTableModule} from 'primeng/treetable'
import {toAccountTreeNodes} from '../../../api/organization-level/chart-of-accounts/account.model'
import {AccountService} from '../../../api/organization-level/chart-of-accounts/account.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {MoneyComponent} from '../../reusable/money.component'
import {AccountsGridComponent} from './accounts-grid/accounts-grid.component'

@Component({
  selector: 'rts-chart-of-accounts',
  templateUrl: 'chart-of-accounts.component.html',
  imports: [
    TableModule,
    AutoStretchDirective,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    NgTemplateOutlet,
    MarkdownComponent,
    TreeTableModule,
    ButtonModule,
    MoneyComponent,
    FormsModule,
    AccountsGridComponent
  ]
})
export class ChartOfAccountsComponent {
  private readonly accountService = inject(AccountService)
  readonly apiService = this.accountService

  readonly accounts = this.accountService.selectAll
  readonly loading = this.accountService.selectLoading

  readonly accountsChart = computed(() => toAccountTreeNodes(this.accounts()))

  refresh() {
    this.accountService.refetch()
  }

}
