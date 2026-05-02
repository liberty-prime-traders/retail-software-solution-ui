import {AsyncPipe, NgClass, NgOptimizedImage} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {RouterLink, RouterOutlet} from '@angular/router'
import {NgxResizeObserverModule} from 'ngx-resize-observer'
import {PrimeTemplate} from 'primeng/api'
import {Button} from 'primeng/button'
import {Splitter} from 'primeng/splitter'
import {Tooltip} from 'primeng/tooltip'
import {RtsOktaService} from '../../utils/services/rts-okta.service'
import {SessionContextService} from '../../utils/services/session-context.service'
import {AutoStretchService} from '../reusable/auto-stretch.service'
import {LocationNavContentComponent} from './top-navigation/location-nav-content/location-nav-content.component'
import {LocationPillConfig, OrganizationPillConfig, PlatformPillConfig} from './top-navigation/navigation-scope.model'
import {
  OrganizationNavContentComponent
} from './top-navigation/organization-nav-content/organization-nav-content.component'
import {ScopePillComponent} from './top-navigation/scope-pill/scope-pill.component'
import {
  UserAccountNavContentComponent
} from './top-navigation/user-account-nav-content/user-account-nav-content.component'

@Component({
  selector: 'rts-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.scss'],
  providers: [NgxResizeObserverModule],
  imports: [
    RouterOutlet,
    Button,
    RouterLink,
    AsyncPipe,
    FormsModule,
    Tooltip,
    NgxResizeObserverModule,
    NgOptimizedImage,
    Splitter,
    PrimeTemplate,
    ScopePillComponent,
    OrganizationNavContentComponent,
    LocationNavContentComponent,
    UserAccountNavContentComponent,
    NgClass
  ]
})
export class WelcomeComponent implements OnInit {
  private readonly rtsOktaService = inject(RtsOktaService)
  readonly sessionContextService = inject(SessionContextService)
  private readonly autoStretchService = inject(AutoStretchService)

  readonly darkMode = model(false)
  readonly fullScreen = signal(false)

  readonly isLoggedIn$ = this.rtsOktaService.loggedIn$
  readonly PlatformPillConfig = PlatformPillConfig
  readonly OrganizationPillConfig = OrganizationPillConfig
  readonly LocationPillConfig = LocationPillConfig


  ngOnInit() {
    this.onResize()
  }


  setFullScreen(isFullScreen: boolean): void {
    this.fullScreen.set(isFullScreen)
    this.onResize()
  }

  protected onResize() {
    this.autoStretchService.triggerStretch()
  }

}
