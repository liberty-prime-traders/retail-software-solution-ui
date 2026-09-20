import {NgClass} from '@angular/common'
import {Component, inject, OnInit, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {AuthorityService} from '../../../api/cross-tier/authorization/authority.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {NullishToZeroPipe} from '../../../utils/pipes/nullish-to-zero.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {ExpandableGridComponent} from '../../reusable/expandable-grid.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {AuthorityHolderComponent} from './authority-holder.component'

@Component({
  selector: 'rts-platform-authorities',
  templateUrl: './platform-authorities.component.html',
  imports: [
    TableModule,
    ButtonDirective,
    EmptyRowComponent,
    GridFilterComponent,
    NgClass,
    AutoStretchDirective,
    PrettifyEnumPipe,
    AuthorityHolderComponent,
    NullishToZeroPipe
  ]
})
export class PlatformAuthoritiesComponent extends ExpandableGridComponent<AuthorityService> implements OnInit {
  private readonly authorityService = inject(AuthorityService)
  readonly apiService = this.authorityService

  readonly authorities = this.authorityService.selectForGroup(signal(SchemaLevel.PLATFORM))

  override ngOnInit() {
    this.authorityService.refetch(SchemaLevel.PLATFORM)
  }

}
