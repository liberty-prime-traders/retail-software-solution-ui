import {CurrencyPipe, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {MarkdownComponent} from 'ngx-markdown'
import {TreeNode} from 'primeng/api'
import {TableModule} from 'primeng/table'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {TreeTableModule} from 'primeng/treetable'
import {Account} from '../../../api/organization-level/chart-of-accounts/account.model'
import {AccountService} from '../../../api/organization-level/chart-of-accounts/account.service'
import {BooleanToTextPipe} from '../../../utils/pipes/boolean-to-text.pipe'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {BaseGridComponent} from '../../reusable/base-grid.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'rts-chart-of-accounts',
  templateUrl: 'chart-of-accounts.component.html',
  imports: [
    TableModule,
    PrettifyEnumPipe,
    NullSafePipe,
    CurrencyPipe,
    GridFilterComponent,
    EmptyRowComponent,
    AutoStretchDirective,
    BooleanToTextPipe,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    NgTemplateOutlet,
    MarkdownComponent,
    TreeTableModule
  ]
})
export class ChartOfAccountsComponent extends BaseGridComponent<AccountService> {
  private readonly accountService = inject(AccountService)
  readonly apiService = this.accountService

  readonly accounts = this.accountService.selectAll

  readonly accountsChart = computed(() => this.toTreeNodes(this.accounts()))

  private toTreeNodes(accounts: Account[]): TreeNode<Account>[] {
    const map = new Map<EntityId, TreeNode>();
    const roots: TreeNode[] = [];

    accounts.forEach(account => {
      map.set(
        account.id,
        {
          label: `${account.name} (${account.code})`,
          data: account,
          key: account.code,
          children: []
        });
    });

    accounts.forEach(account => {
      const node = map.get(account.id)!;
      if (account.parentAccountId) {
        map.get(account.parentAccountId)?.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}
