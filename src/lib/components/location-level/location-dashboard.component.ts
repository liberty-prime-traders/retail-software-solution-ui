import {Component, inject, signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {SaleFormContext} from './sales/form-utils/sale-form-context'
import {SaleFormVisibilityContext} from './sales/sale-form-visibility.context'
import {SaleFormComponent} from './sales/sale-form/sale-form.component'

@Component({
  selector: 'rts-private',
  providers: [SaleFormContext, SaleFormVisibilityContext],
  imports: [
    RouterOutlet,
    Button,
    Menu,
    Card,
    SaleFormComponent
  ],
  templateUrl: 'location-dashboard.component.html',
  styleUrls: ['sale-button.component.scss']
})
export class LocationDashboardComponent {

  readonly saleFormVisibilityContext = inject(SaleFormVisibilityContext)

  readonly showNavigation = signal(true)

  private readonly commonTasksMenuItems: MenuItem[] = [
    {label: 'Summary', icon: 'pi pi-home', routerLink: './', routerLinkActiveOptions: {exact: true}},
    {label: 'Products', icon: 'pi pi-objects-column', routerLink: 'products'},
    {label: 'Purchases', icon: 'pi pi-truck', routerLink: 'purchases'},
    {label: 'Sales', icon: 'pi pi-receipt', routerLink: 'sales'},
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
