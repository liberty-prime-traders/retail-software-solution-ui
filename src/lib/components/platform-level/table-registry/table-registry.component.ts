import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {TableModule} from 'primeng/table'
import {TableRegistryService} from '../../../api/platform-level/table-registry/table-registry.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {ExpandableGridComponent} from '../../reusable/expandable-grid.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {TableRegistryFormComponent} from './table-registry-form/table-registry-form.component'

@Component({
  selector: 'rts-table-registries',
  templateUrl: 'table-registry.component.html',
  imports: [
    TableModule,
    Button,
    NullSafePipe,
    PrettifyEnumPipe,
    EmptyRowComponent,
    GridFilterComponent,
    TableRegistryFormComponent,
    Card,
    NgClass
  ]
})
export class TableRegistryComponent extends ExpandableGridComponent<TableRegistryService> {
  private readonly tableRegistryService = inject(TableRegistryService)
  protected readonly apiService = this.tableRegistryService

  readonly registries = this.tableRegistryService.selectAll

  validateTable(registryId: string) {
    this.tableRegistryService.validateRegistry(registryId)
  }
}
