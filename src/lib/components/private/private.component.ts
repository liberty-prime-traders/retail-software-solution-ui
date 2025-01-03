import {AfterViewInit, Component, HostListener, inject, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {Button} from 'primeng/button'
import {SysUserService} from '../../api/sys-user/sys-user.service'
import {NavigationComponent} from './navigation/navigation.component'

@Component({
  standalone: true,
  selector: 'rts-private',
  imports: [
    RouterOutlet,
    NavigationComponent,
    Button
  ],
  templateUrl: 'private.component.html'
})
export class PrivateComponent implements OnInit, AfterViewInit {
  private readonly userService = inject(SysUserService)

  showNavigation = true

  ngOnInit() {
    this.userService.post()
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
