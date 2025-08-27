import {Component, computed, inject} from '@angular/core'
import {SysUserService} from '../../../api/platform-level/sys-user/sys-user.service'

@Component({
  selector: 'rts-location-summary',
  templateUrl: 'location-summary.component.html',
  imports: []
})
export class LocationSummaryComponent {
  private readonly userService = inject(SysUserService)
  private readonly loggedInUser = this.userService.selectFirst

  readonly userFullName = computed(() => {
    const user = this.loggedInUser()
    return user ? `${user?.firstName} ${user?.lastName}` : ''
  })
}
