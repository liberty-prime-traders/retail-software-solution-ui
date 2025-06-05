import {AfterViewInit, Component, HostListener, inject, OnInit, signal} from '@angular/core'
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router'
import {Button} from 'primeng/button'
import {SessionContextService} from '../../utils/services/session-context.service'
import {NavigationComponent} from './navigation/navigation.component'

@Component({
  selector: 'rts-private',
  imports: [
    RouterOutlet,
    NavigationComponent,
    Button
  ],
  templateUrl: 'location-dashboard.component.html'
})
export class LocationDashboardComponent implements AfterViewInit, OnInit {
  private readonly sessionContextService = inject(SessionContextService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)

  readonly showNavigation = signal(true)

  ngOnInit() {
    if (!this.sessionContextService.locationIsSelected()) {
      this.router.navigate(['..'], {relativeTo: this.activatedRoute}).then()
    }
  }

  ngAfterViewInit() {
    this.adjustCardHeight()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustCardHeight()
  }

  private adjustCardHeight() {
    const card = document.querySelector('#card-content') as HTMLElement
    if (card) {
      const topPosition = card.getBoundingClientRect().top
      const heightToBottom = window.innerHeight - topPosition
      card.style.height = `${heightToBottom}px`
    }
  }
}
