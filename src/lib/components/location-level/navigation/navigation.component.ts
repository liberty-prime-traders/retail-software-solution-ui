import {Component} from '@angular/core'
import {MenuItem} from 'primeng/api'
import {Menu} from 'primeng/menu'

@Component({
  selector: 'rts-navigation',
  templateUrl: 'navigation.component.html',
  imports: [
    Menu
  ]
})
export class NavigationComponent {

  private readonly transactionScreensMenuItems: MenuItem[] = [
    {label: 'Sales', icon: 'pi pi-receipt'},
    {label: 'Purchase Orders', icon: 'pi pi-truck'},
    {label: 'Expenses', icon: 'pi pi-wallet'}
  ]

  private readonly commonTasksMenuItems: MenuItem[] = [
    {label: 'Summary', icon: 'pi pi-home', routerLink: './', routerLinkActiveOptions: {exact: true}},
    {label: 'External Contacts', icon: 'pi pi-address-book'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Home', items: this.commonTasksMenuItems},
    {label: 'Transactions', items: this.transactionScreensMenuItems}
  ]
}
