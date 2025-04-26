import {AfterViewInit, Component, HostListener, inject, OnInit, signal} from '@angular/core'
import {Router, RouterOutlet} from '@angular/router'
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
  templateUrl: 'private.component.html'
})
export class PrivateComponent implements AfterViewInit, OnInit {
  private readonly sessionContextService = inject(SessionContextService)
  private readonly router = inject(Router)
  
  readonly showNavigation = signal(true)

  ngOnInit() {
    if (!this.sessionContextService.selectedOrganization()) {
      this.router.navigate(['/landing']).then()
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
