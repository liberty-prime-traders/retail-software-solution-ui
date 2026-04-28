import {NgStyle} from '@angular/common'
import {Component, computed, inject, input, viewChild} from '@angular/core'
import {Router} from '@angular/router'
import {Popover} from 'primeng/popover'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {NavigationScope, ScopePillConfig} from '../navigation-scope.model'

@Component({
  selector: 'rts-scope-pill',
  templateUrl: 'scope-pill.component.html',
  imports: [
    NgStyle,
    Popover
  ]
})
export class ScopePillComponent {
  private readonly sessionContextService = inject(SessionContextService)
  private readonly router = inject(Router)
  private readonly popOverComponent = viewChild.required(Popover)

  readonly config = input.required<ScopePillConfig>()

  readonly isActive = computed(() =>
    this.sessionContextService.selectedScope() === this.config().scope
  )

  readonly showChevron = computed(() => {
    if (this.isActive()) {
      return this.config().scope !== NavigationScope.PLATFORM
    }
    if (this.config().scope === NavigationScope.ORG) {
      return !this.sessionContextService.selectedOrganization()
    }
    if (this.config().scope === NavigationScope.LOCATION) {
      return !!this.sessionContextService.selectedOrganization()
        && !this.sessionContextService.selectedLocation()
    }
    return false
  })

  readonly detailText = computed(() =>
    this.currentOrganizationOrLocation()?.name ?? this.config().placeholder
  )

  readonly activeBgStyle = computed(() =>
    this.isActive() ? { 'background-color': this.config().activeBgColor } : {}
  )

  readonly currentOrganizationOrLocation = computed(() => {
    switch (this.config().scope) {
      case NavigationScope.ORG: return this.sessionContextService.selectedOrganization()
      case NavigationScope.LOCATION: return this.sessionContextService.selectedLocation()
      default: return null
    }
  })

  handleClick(event: MouseEvent) {
    if (this.isActive() && this.config().scope !== NavigationScope.PLATFORM) {
      this.showPopOver(event)
      return
    }

    if (this.config().scope === NavigationScope.ORG) {
      if (!this.sessionContextService.selectedOrganization()) {
        this.showPopOver(event)
        return
      }
    }

    if (this.config().scope === NavigationScope.LOCATION) {
      if (!this.sessionContextService.selectedLocation()) {
        this.showPopOver(event)
        return
      }
    }

    this.router.navigate([this.config().routerLink]).then()

  }

  private showPopOver(event: MouseEvent) {
    this.popOverComponent().toggle(event)
  }

}
