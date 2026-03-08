import {Component} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Menu} from 'primeng/menu'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'

@Component({
  selector: 'rts-manage-platform',
  templateUrl: './manage-platform.component.html',
  imports: [
    RouterOutlet,
    Menu,
    AutoStretchDirective
  ]
})
export class ManagePlatformComponent {

  private readonly homeMenuItems: MenuItem[] = [
    {label: 'Organizations', icon: 'pi pi-home', routerLink: 'organizations'},
    {label: 'Passes', icon: 'pi pi-id-card', routerLink: 'authorization-passes'},
  ]

  private readonly databaseConfigs: MenuItem[] = [
    {label: 'DB Versions', icon: 'pi pi-database', routerLink: 'db-versions'},
    {label: 'DB Migrations', icon: 'pi pi-sync', routerLink: 'db-migrations'},
    {label: 'Table Registry', icon: 'pi pi-table', routerLink: 'table-registry'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Home', items: this.homeMenuItems},
    {label: 'DB Config', items: this.databaseConfigs}
  ]
}
