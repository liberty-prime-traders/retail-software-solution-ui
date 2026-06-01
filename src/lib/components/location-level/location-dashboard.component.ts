import {CdkDrag} from '@angular/cdk/drag-drop'
import {Component, inject, signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {SaleFormNavigator} from './sales/form-utils/sale-form-navigator'
import {SaleFormVisibilityContext} from './sales/sale-form-visibility.context'
import {SaleFormComponent} from './sales/sale-form/sale-form.component'

@Component({
  selector: 'rts-private',
  imports: [
    RouterOutlet,
    Button,
    Menu,
    Card,
    SaleFormComponent,
    CdkDrag
  ],
  templateUrl: 'location-dashboard.component.html',
  styleUrls: ['sale-button.component.scss']
})
export class LocationDashboardComponent {

  readonly saleFormVisibilityContext = inject(SaleFormVisibilityContext)
  readonly saleFormNavigator = inject(SaleFormNavigator)

  readonly showNavigation = signal(true)

  private readonly commonTasksMenuItems: MenuItem[] = [
    {label: 'Summary', icon: 'pi pi-home', routerLink: './', routerLinkActiveOptions: {exact: true}},
    {label: 'Products', icon: 'pi pi-objects-column', routerLink: 'products'},
    {label: 'Purchases', icon: 'pi pi-truck', routerLink: 'purchases'},
    {label: 'Sales', icon: 'pi pi-receipt', routerLink: 'sales'},
    {label: 'Expenses', icon: 'pi pi-money-bill'},
    {label: 'Fixtures', icon: 'pi pi-box'}
  ]

  private readonly adminTasksMenuItems: MenuItem[] = [
    {label: 'Sync', icon: 'pi pi-sync', routerLink: 'sync'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Menu', items: this.commonTasksMenuItems},
    {label: 'Admin Tasks', items: this.adminTasksMenuItems}
  ]

}
