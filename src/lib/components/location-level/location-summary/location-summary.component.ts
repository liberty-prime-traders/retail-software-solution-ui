import {Component, inject} from '@angular/core'
import {UserContextService} from '../../../utils/services/user-context.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'

@Component({
  selector: 'rts-location-summary',
  templateUrl: 'location-summary.component.html',
  imports: [
    AutoStretchDirective
  ]
})
export class LocationSummaryComponent {
  private readonly userContextService = inject(UserContextService)
  readonly userFullName = this.userContextService.displayName
}
