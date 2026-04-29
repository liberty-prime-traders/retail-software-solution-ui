import {Component, inject} from '@angular/core'
import {UserContextService} from '../../../utils/services/user-context.service'

@Component({
  selector: 'rts-location-summary',
  templateUrl: 'location-summary.component.html',
  imports: []
})
export class LocationSummaryComponent {
  private readonly userContextService = inject(UserContextService)
  readonly userFullName = this.userContextService.displayName
}
