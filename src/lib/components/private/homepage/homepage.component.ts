import {AsyncPipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {map} from 'rxjs'
import {SysUserService} from '../../../api/sys-user/sys-user.service'

@Component({
  standalone: true,
  selector: 'rts-homepage',
  templateUrl: 'homepage.component.html',
  imports: [
    AsyncPipe
  ]
})
export class HomepageComponent {
  private readonly userService = inject(SysUserService)
  private readonly loggedInUser$ = this.userService.selectFirst$()

  readonly userFullName$ = this.loggedInUser$.pipe(
    map(user => `${user.firstName} ${user.lastName}`)
  )
}
