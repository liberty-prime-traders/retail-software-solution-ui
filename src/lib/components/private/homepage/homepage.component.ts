import {Component, computed, inject} from '@angular/core'
import {SysUserService} from '../../../api/sys-user/sys-user.service'

@Component({
  selector: 'rts-homepage',
  templateUrl: 'homepage.component.html',
  imports: []
})
export class HomepageComponent {
  private readonly userService = inject(SysUserService)
  private readonly loggedInUser = this.userService.selectFirst

  readonly userFullName = computed(() => {
    const user = this.loggedInUser()
    return `${user?.firstName} ${user?.lastName}`
  })
}
