import {Component, inject, signal} from '@angular/core'
import {Card} from 'primeng/card'
import {TableModule} from 'primeng/table'
import {Button} from 'primeng/button'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasEditableGridComponent} from '../../reusable/has-editable-grid.component'
import {TableRegistryService} from '../../../api/platform-level/table-registry/table-registry.service'
import {TableRegistryFormComponent} from './table-registry-form/table-registry-form.component'

@Component({
  selector: 'rts-table-registries',
  templateUrl: 'table-registry.component.html',
  imports: [
    TableModule,
    Button,
    NullSafePipe,
    PrettifyEnumPipe,
    AddRowComponent,
    EmptyRowComponent,
    GridFilterComponent,
    TableRegistryFormComponent,
    Card
  ]
})
export class TableRegistryComponent extends HasEditableGridComponent<TableRegistryService> {
  private readonly service = inject(TableRegistryService)

  readonly loading = this.service.selectLoading
  readonly registries = this.service.selectAll

  readonly apiService = this.service
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)
}
