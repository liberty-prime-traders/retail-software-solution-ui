import {Component, inject} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {OpeningStockService} from '../../../api/location-level/opening-stock/opening-stock.service'
import {UserContextService} from '../../../utils/services/auth/user-context.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'

@Component({
  selector: 'rts-location-summary',
  templateUrl: 'location-summary.component.html',
  imports: [
    AutoStretchDirective,
    ButtonDirective
  ]
})
export class LocationSummaryComponent {
  private readonly userContextService = inject(UserContextService)
  private readonly openingStockService = inject(OpeningStockService)
  readonly userFullName = this.userContextService.userFullName

  fetchReport() {
    this.openingStockService.getReport()
  }
}
