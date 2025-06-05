import {Component} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Menu} from 'primeng/menu'

@Component({
  selector: 'rts-manage-organization',
  templateUrl: 'organization-dashboard.component.html',
  imports: [
    RouterOutlet,
    Menu
  ]
})
export class OrganizationDashboardComponent {
  private readonly organizationHomeMenuItems: MenuItem[] = [
    {label: 'Summary', icon: 'pi pi-home', routerLink: 'summary'}
  ]

  private readonly orgAdminSettings: MenuItem[] = [
    {label: 'Locations', icon: 'pi pi-map-marker', routerLink: 'locations'},
    {label: 'Users', icon: 'pi pi-users'},
    {label: 'Join Requests', icon: 'pi pi-users', routerLink: 'join-requests'},
    {label: 'Admins', icon: 'pi pi-lock', routerLink: 'admins'},
    {label: 'Org Profile', icon: 'pi pi-cog', routerLink: 'profile'}
  ]

  private readonly businessSettingsMenuItems: MenuItem[] = [
    {label: 'Products', icon: 'pi pi-objects-column', routerLink: 'products'},
    {label: 'Job Titles', icon: 'pi pi-gauge', routerLink: 'job-title'},
    {label: 'Categories', icon: 'pi pi-palette', routerLink: 'category'},
    {label: 'Units', icon: 'pi pi-percentage', routerLink: 'units'},
    {label: 'Payment Options', icon: 'pi pi-money-bill', routerLink: 'payment-options'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Home', items: this.organizationHomeMenuItems},
    {label: 'Business Settings', items: this.businessSettingsMenuItems},
    {label: 'Admin Settings', items: this.orgAdminSettings}
  ]
}
