import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {MarkdownComponent} from 'ngx-markdown'
import {ButtonModule} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {TreeTableModule} from 'primeng/treetable'
import {toAccountTreeNodes} from '../../../api/organization-level/chart-of-accounts/account.model'
import {AccountService} from '../../../api/organization-level/chart-of-accounts/account.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {MoneyComponent} from '../../reusable/money.component'
import {AccountFormComponent} from './account-form/account-form.component'

@Component({
  selector: 'rts-chart-of-accounts',
  templateUrl: 'chart-of-accounts.component.html',
  imports: [
    TableModule,
    PrettifyEnumPipe,
    NullSafePipe,
    GridFilterComponent,
    EmptyRowComponent,
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
    AccountFormComponent,
    NgClass,
    MoneyComponent
  ]
})
export class ChartOfAccountsComponent extends GridWithAddButtonComponent<AccountService> {
  private readonly accountService = inject(AccountService)
  readonly apiService = this.accountService

  readonly accounts = this.accountService.selectAll

  readonly accountsChart = computed(() => toAccountTreeNodes(this.accounts()))
}
