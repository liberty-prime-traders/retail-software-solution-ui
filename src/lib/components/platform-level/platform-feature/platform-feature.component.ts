import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {PlatformFeatureService} from '../../../api/platform-level/platform-feature/platform-feature.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {ExpandableGridComponent} from '../../reusable/expandable-grid.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {PlatformFeatureFormComponent} from './platform-feature-form/platform-feature-form.component'

@Component({
  selector: 'rts-platform-feature',
  templateUrl: 'platform-feature.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    PlatformFeatureFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    AutoStretchDirective,
    PrettifyEnumPipe
  ]
})
export class PlatformFeatureComponent extends ExpandableGridComponent<PlatformFeatureService> {
  private readonly platformFeatureService = inject(PlatformFeatureService)
  readonly apiService = this.platformFeatureService

  readonly platformFeatures = this.platformFeatureService.selectAll
}
