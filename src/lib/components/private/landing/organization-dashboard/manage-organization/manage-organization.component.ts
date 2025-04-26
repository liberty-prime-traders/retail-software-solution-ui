import {Component} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Menu} from 'primeng/menu'

@Component({
  selector: 'rts-manage-organization',
  templateUrl: 'manage-organization.component.html',
  imports: [
    RouterOutlet,
    Menu
  ]
})
export class ManageOrganizationComponent {
  readonly orgManagementMenuItems: MenuItem[] = [
    {label: 'Locations', icon: 'pi pi-map-marker', routerLink: 'locations'},
    {label: 'Settings', icon: 'pi pi-cog', routerLink: 'settings'},
    {label: 'Admins', icon: 'pi pi-users', routerLink: 'admins'}
  ]
}
