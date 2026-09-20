import {Component, inject, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Menu} from 'primeng/menu'
import {PlatformSysUserService} from '../../../api/platform-level/sys-user/platform-sys-user.service'
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
export class ManagePlatformComponent implements OnInit {

  private readonly platformUserService = inject(PlatformSysUserService)

  private readonly homeMenuItems: MenuItem[] = [
    {label: 'Organizations', icon: 'pi pi-home', routerLink: 'organizations'},
    {label: 'Passes', icon: 'pi pi-id-card', routerLink: 'authorization-passes'},
    {label: 'Access Control', icon: 'pi pi-lock', routerLink: 'access-control'},
  ]

  private readonly legalMenuItems: MenuItem[] = [
    {label: 'Jurisdiction Types', icon: 'pi pi-map', routerLink: 'jurisdiction-types'},
    {label: 'Tax Types', icon: 'pi pi-percentage', routerLink: 'tax-types'},
    {label: 'Jurisdictions', icon: 'pi pi-hammer', routerLink: 'jurisdictions'},
  ]

  private readonly configMenuItems: MenuItem[] = [
    {label: 'Platform Features', icon: 'pi pi-sliders-h', routerLink: 'platform-features'},
    {label: 'Table Registry', icon: 'pi pi-table', routerLink: 'table-registry'}
  ]

  private readonly databaseConfigs: MenuItem[] = [
    {label: 'DB Versions', icon: 'pi pi-database', routerLink: 'db-versions'},
    {label: 'DB Migrations', icon: 'pi pi-sync', routerLink: 'db-migrations'}
  ]

  readonly menuItems: MenuItem[] = [
    {label: 'Home', items: this.homeMenuItems},
    {separator: true},
    {label: 'Legal', items: this.legalMenuItems},
    {separator: true},
    {label: 'Config', items: this.configMenuItems},
    {separator: true},
    {label: 'Database', items: this.databaseConfigs}
  ]

  ngOnInit() {
    this.platformUserService.fetch()
  }
}
