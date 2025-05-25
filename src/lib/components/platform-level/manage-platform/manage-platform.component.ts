import {Component} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {Menu} from 'primeng/menu'
import {MenuItem} from 'primeng/api'

@Component({
  selector: 'rts-manage-platform',
  templateUrl: './manage-platform.component.html',
  imports: [
    RouterOutlet,
    Menu
  ]
})
export class ManagePlatformComponent {
  private readonly homeMenuItems: MenuItem[] = [
    {label: 'Organizations', icon: 'pi pi-home', routerLink: 'organizations'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Home', items: this.homeMenuItems}
  ]
}
