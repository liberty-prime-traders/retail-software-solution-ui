import {NgClass} from '@angular/common'
import {TimezoneAwareDatePipe} from '../../../utils/pipes/timezone-aware-date.pipe'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {AuthorizationPassService} from '../../../api/platform-level/authorization-pass/authorization-pass.service'
import {PassStatus} from '../../../api/platform-level/authorization-pass/pass-status.enum'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../utils/pipes/nullish-to-zero.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {AuthorizationPassFormComponent} from './authorization-pass-form/authorization-pass-form.component'

@Component({
  selector: 'rts-authorization-pass',
  templateUrl: 'authorization-pass.component.html',
  imports: [
    TableModule,
    Button,
    NullSafePipe,
    PrettifyEnumPipe,
    NgClass,
    AutoStretchDirective,
    EmptyRowComponent,
    GridFilterComponent,
    AuthorizationPassFormComponent,
    TimezoneAwareDatePipe,
    NullishToZeroPipe
  ]
})
export class AuthorizationPassComponent extends GridWithAddButtonComponent<AuthorizationPassService> {
  private readonly authorizationPassService = inject(AuthorizationPassService)
  readonly apiService = this.authorizationPassService

  readonly PassStatus = PassStatus

  readonly passes = this.authorizationPassService.selectAll
}
