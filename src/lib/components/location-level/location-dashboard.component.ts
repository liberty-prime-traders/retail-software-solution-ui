import {CdkDrag} from '@angular/cdk/drag-drop'
import {Component, computed, inject, OnInit, Signal, signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {LocationMembershipUserService} from '../../api/location-level/membership/location-membership-user.service'
import {OrgMembershipUserService} from '../../api/organization-level/membership/org-membership-user.service'
import {UserContextService} from '../../utils/services/auth/user-context.service'
import {SaleFormNavigator} from './sales/form-utils/sale-form-navigator'
import {SaleFormVisibilityContext} from './sales/sale-form-visibility.context'
import {SaleFormComponent} from './sales/sale-form/sale-form.component'

@Component({
  selector: 'rts-private',
  imports: [
    RouterOutlet,
    ButtonDirective,
    Menu,
    Card,
    SaleFormComponent,
    CdkDrag
  ],
  templateUrl: 'location-dashboard.component.html',
  styleUrls: ['sale-button.component.scss']
})
export class LocationDashboardComponent implements OnInit {

  readonly saleFormVisibilityContext = inject(SaleFormVisibilityContext)
  readonly saleFormNavigator = inject(SaleFormNavigator)
  private readonly orgMembershipUserService = inject(OrgMembershipUserService)
  private readonly locationMembershipUserService = inject(LocationMembershipUserService)
  private readonly userContextService = inject(UserContextService)

  readonly showNavigation = signal(true)

  private readonly commonTasksMenuItems: MenuItem[] = [
    {label: 'Summary', icon: 'pi pi-home', routerLink: './', routerLinkActiveOptions: {exact: true}},
    {label: 'Products', icon: 'pi pi-objects-column', routerLink: 'products'}
  ]

  private readonly transactionsMenuItems: MenuItem[] = [
    {label: 'Sales', icon: 'pi pi-receipt', routerLink: 'sales'},
    {label: 'Sale Payments', icon: 'pi pi-dollar', routerLink: 'sale-payments'},
    {label: 'Purchases', icon: 'pi pi-truck', routerLink: 'purchases'},
    {label: 'Taxes', icon: 'pi pi-money-bill', routerLink: 'taxes'},
    {label: 'Stock Transfers', icon: 'pi pi-send', routerLink: 'stock-transfer'},
    {label: 'Expenses', icon: 'pi pi-wallet', routerLink: 'expenses'}
  ]

  private readonly adminSectionMenuItems: MenuItem[] = [
    {label: 'Sync', icon: 'pi pi-sync', routerLink: 'sync'},
    {label: 'Users', icon: 'pi pi-users', routerLink: 'users'},
    {label: 'Fixtures', icon: 'pi pi-box'}
  ]

  readonly menuItems: Signal<MenuItem[]> = computed(() => {
    if (!this.userContextService.isLibertyAdmin()) {
      return [
        ...this.commonTasksMenuItems,
        {label: 'Sales', icon: 'pi pi-receipt', routerLink: 'sales'}
      ]
    }
    return [
      {label: 'Menu', items: this.commonTasksMenuItems},
      {separator: true},
      {label: 'Transactions', items: this.transactionsMenuItems},
      {separator: true},
      {label: 'Admin Section', items: this.adminSectionMenuItems}
    ]
  })

  ngOnInit(): void {
    this.locationMembershipUserService.fetch()
    this.orgMembershipUserService.fetch()
  }
}
