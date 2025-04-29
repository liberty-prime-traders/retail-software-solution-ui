import {AsyncPipe} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {Card} from 'primeng/card'
import {distinctUntilChanged} from 'rxjs'
import {tap} from 'rxjs/operators'
import {RtsOktaService} from '../../utils/services/rts-okta.service'
import {ScreenSizeService} from '../../utils/services/screen-size.service'
import {HasSubscriptionComponent} from '../reusable/has-subscription.component'

@Component({
  selector: 'rts-public',
  imports: [
    AsyncPipe,
    Card
  ],
  templateUrl: './public.component.html'
})
export class PublicComponent extends HasSubscriptionComponent implements OnInit {
  readonly screenSizeService = inject(ScreenSizeService)
  private readonly router = inject(Router)
  private readonly rtsOktaService = inject(RtsOktaService)
  
  private readonly loggedIn$ = this.rtsOktaService.loggedIn$.pipe(
    distinctUntilChanged(),
    tap(isLoggedIn => {
      if (isLoggedIn) {
        //this.router.navigate(['/secure']).then()
      }
    })
  )
  
  ngOnInit() {
    this.subscriptions.add(this.loggedIn$.subscribe())
  }
}
