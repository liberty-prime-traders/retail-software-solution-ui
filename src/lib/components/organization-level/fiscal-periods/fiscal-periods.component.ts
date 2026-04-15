import {DatePipe, NgTemplateOutlet} from '@angular/common'
import {Component, inject} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Badge} from 'primeng/badge'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {FiscalPeriodService} from '../../../api/organization-level/fiscal-period/fiscal-period.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {ExpandableGridComponent} from '../../reusable/expandable-grid.component'
import {FiscalPeriodCloseComponent} from './fiscal-period-close/fiscal-period-close.component'
import {FiscalPeriodFormComponent} from './fiscal-period-form/fiscal-period-form.component'

@Component({
  selector: 'rts-fiscal-periods',
  templateUrl: 'fiscal-periods.component.html',
  imports: [
    TableModule,
    Button,
    DatePipe,
    NullSafePipe,
    GridFilterComponent,
    EmptyRowComponent,
    AutoStretchDirective,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    FiscalPeriodFormComponent,
    NgTemplateOutlet,
    Badge,
    FiscalPeriodCloseComponent
  ]
})
export class FiscalPeriodsComponent extends ExpandableGridComponent<FiscalPeriodService> {
  private readonly fiscalPeriodService = inject(FiscalPeriodService)
  private readonly messageService = inject(MessageService)
  protected override readonly apiService = this.fiscalPeriodService

  readonly periods = this.fiscalPeriodService.selectAll

  nudge() {
    this.fiscalPeriodService.nudge({
      onSuccess: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Period Generation Triggered',
          detail: 'Fiscal period generation has been scheduled.'
        })
        setTimeout(() => this.fiscalPeriodService.refetch(), 0)
      },
      onFail: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to trigger fiscal period generation.'
        })
      }
    })
  }
}
