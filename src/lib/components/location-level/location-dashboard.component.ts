import {Component, inject, OnInit, signal} from '@angular/core'
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {SessionContextService} from '../../utils/services/session-context.service'

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
export class LocationDashboardComponent implements OnInit {
  private readonly sessionContextService = inject(SessionContextService)
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)

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

  ngOnInit() {
    if (!this.sessionContextService.locationIsSelected()) {
      this.router.navigate(['..'], {relativeTo: this.activatedRoute}).then()
    }
  }
}
