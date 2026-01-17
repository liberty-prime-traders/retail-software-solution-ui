import {Component, computed, inject, signal, Signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem, PrimeTemplate} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {SessionContextService} from '../../utils/services/session-context.service'

@Component({
  selector: 'rts-manage-organization',
  templateUrl: 'organization-dashboard.component.html',
  imports: [
    RouterOutlet,
    Menu,
    Card,
    PrimeTemplate,
    Button
  ]
})
export class OrganizationDashboardComponent {
  private readonly sessionContextService = inject(SessionContextService)

  private readonly organizationHomeMenuItems: MenuItem[] = [
    {label: 'Summary', icon: 'pi pi-home', routerLink: 'summary'}
  ]

  private readonly orgAdminSettings: MenuItem[] = [
    {label: 'Locations', icon: 'pi pi-map-marker', routerLink: 'locations'},
    {label: 'Users', icon: 'pi pi-users', routerLink: 'users'},
    {label: 'Join Requests', icon: 'pi pi-users', routerLink: 'join-requests'},
    {label: 'Admins', icon: 'pi pi-lock', routerLink: 'admins'},
    {label: 'Org Profile', icon: 'pi pi-cog', routerLink: 'profile'}
  ]

  private readonly businessSettingsMenuItems: MenuItem[] = [
    {label: 'Products', icon: 'pi pi-objects-column', routerLink: 'products'},
    {label: 'Product Groups', icon: 'pi pi-clone', routerLink: 'product-groups'},
    {label: 'Job Titles', icon: 'pi pi-gauge', routerLink: 'job-title'},
    {label: 'Categories', icon: 'pi pi-palette', routerLink: 'category'},
    {label: 'Units', icon: 'pi pi-percentage', routerLink: 'units'},
    {label: 'Payment Options', icon: 'pi pi-dollar', routerLink: 'payment-options'},
    {label: 'Tags', icon: 'pi pi-tags', routerLink: 'tags'}
  ]

  readonly menuItems: Signal<MenuItem[]> = computed(() => [
    {label: 'Home', items: this.organizationHomeMenuItems},
    {label: 'Business Settings', items: this.businessSettingsMenuItems},
    {
      label: 'Admin Settings',
      items: this.orgAdminSettings,
      visible: this.sessionContextService.loggedInUserIsOrganizationAdmin()
    }
  ])

  readonly showMenu = signal(true)
}
