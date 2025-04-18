import {Component} from '@angular/core'
import {MenuItem} from 'primeng/api'
import {Menu} from 'primeng/menu'

@Component({
  standalone: true,
  selector: 'rts-navigation',
  templateUrl: 'navigation.component.html',
  imports: [
    Menu
  ]
})
export class NavigationComponent {
  private readonly peopleSettingsMenuItems: MenuItem[] = [
    {label: 'Internal Users', icon: 'pi pi-users'},
    {label: 'External Contacts', icon: 'pi pi-address-book'}
  ]

  private readonly businessSettingsMenuItems: MenuItem[] = [
    {label: 'Job Titles', icon: 'pi pi-gauge', routerLink: './job-title'},
    {label: 'Categories', icon: 'pi pi-palette', routerLink: './category'},
    {label: 'Variations', icon: 'pi pi-wave-pulse'},
    {label: 'Units', icon: 'pi pi-percentage', routerLink: './units'},
    {label: 'Payment Options', icon: 'pi pi-money-bill', routerLink: './payment-options'}
  ]

  private readonly transactionScreensMenuItems: MenuItem[] = [
    {label: 'Products', icon: 'pi pi-objects-column'},
    {label: 'Sales', icon: 'pi pi-receipt'},
    {label: 'Purchase Orders', icon: 'pi pi-truck'},
    {label: 'Expenses', icon: 'pi pi-wallet'}
  ]

  private readonly commonTasksMenuItems: MenuItem[] = [
    {label: 'Home', icon: 'pi pi-home', routerLink: './'},
    {label: 'Organization Tree', icon: 'pi pi-sitemap', routerLink: './organization-tree'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Common Tasks', items: this.commonTasksMenuItems},
    {label: 'People Management', items: this.peopleSettingsMenuItems},
    {label: 'Business Settngs', items: this.businessSettingsMenuItems},
    {label: 'Transactions', items: this.transactionScreensMenuItems}
  ]
}
