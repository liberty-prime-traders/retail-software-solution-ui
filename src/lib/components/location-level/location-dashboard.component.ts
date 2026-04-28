import {Component, signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'

@Component({
  selector: 'rts-private',
  imports: [
    RouterOutlet,
    Button,
    Menu,
    Card
  ],
  templateUrl: 'location-dashboard.component.html'
})
export class LocationDashboardComponent {

  readonly showNavigation = signal(true)

  private readonly commonTasksMenuItems: MenuItem[] = [
    {label: 'Summary', icon: 'pi pi-home', routerLink: './', routerLinkActiveOptions: {exact: true}},
    {label: 'Products', icon: 'pi pi-objects-column', routerLink: 'products'},
    {label: 'Purchases', icon: 'pi pi-truck', routerLink: 'purchases'},
    {label: 'Sales', icon: 'pi pi-receipt'},
    {label: 'Expenses', icon: 'pi pi-money-bill'},
    {label: 'Inventory', icon: 'pi pi-box'}
  ]

  private readonly adminTasksMenuItems: MenuItem[] = [
    {label: 'Sync', icon: 'pi pi-sync', routerLink: 'sync'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Menu', items: this.commonTasksMenuItems},
    {label: 'Admin Tasks', items: this.adminTasksMenuItems}
  ]

}
