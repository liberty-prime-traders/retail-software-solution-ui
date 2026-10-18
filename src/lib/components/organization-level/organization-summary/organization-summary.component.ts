import {Component} from '@angular/core'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'

@Component({
  selector: 'rts-homepage',
  templateUrl: 'organization-summary.component.html',
  imports: [
    AutoStretchDirective
  ]
})
export class OrganizationSummaryComponent {

}
