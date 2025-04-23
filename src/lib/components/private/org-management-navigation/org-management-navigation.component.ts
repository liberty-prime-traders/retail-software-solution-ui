import {Component} from '@angular/core'
import {MenuItem} from 'primeng/api'
import {Menu} from 'primeng/menu'

@Component({
  selector: 'rts-org-management-navigation',
  templateUrl: 'org-management-navigation.component.html',
  imports: [
    Menu
  ]
})
export class OrgManagementNavigationComponent {
  private readonly orgManagementMenuItems: MenuItem[] = [
    {label: 'Locations', icon: 'pi pi-map-marker', routerLink: './manage/locations'},
    {label: 'Settings', icon: 'pi pi-cog', routerLink: './manage/settings'},
    {label: 'Admins', icon: 'pi pi-users', routerLink: './manage/admins'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Manage Organization', items: this.orgManagementMenuItems}
  ]
}
