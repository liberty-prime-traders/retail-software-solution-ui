import {CdkDrag} from '@angular/cdk/drag-drop'
import {NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, OnInit, Signal, signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {LocationMembershipUserService} from '../../api/location-level/membership/location-membership-user.service'
import {OrgMembershipUserService} from '../../api/organization-level/membership/org-membership-user.service'
import {UserContextService} from '../../utils/services/auth/user-context.service'
import {AutoStretchDirective} from '../reusable/auto-stretch.directive'
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
    CdkDrag,
    AutoStretchDirective,
    NgTemplateOutlet
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
    {label: 'Daily Summary', icon: 'pi pi-chart-bar', routerLink: 'daily-summary', visible: false},
    {label: 'Products', icon: 'pi pi-objects-column', routerLink: 'products'}
  ]

  private readonly transactionsMenuItems: MenuItem[] = [
    {label: 'Sales', icon: 'pi pi-receipt', routerLink: 'sales'},
    {label: 'Purchases', icon: 'pi pi-truck', routerLink: 'purchases'},
    {label: 'Bulk Payment', icon: 'pi pi-wallet', routerLink: 'purchases-bulk-payment'},
    {label: 'Taxes', icon: 'pi pi-money-bill', routerLink: 'taxes'},
    {label: 'Stock Transfers', icon: 'pi pi-send', routerLink: 'stock-transfer'},
    {label: 'Stock Adjustments', icon: 'pi pi-sliders-h', routerLink: 'stock-adjustments'},
    {label: 'Expenses', icon: 'pi pi-wallet', routerLink: 'expenses'}
  ]

  private readonly reportsMenuItems: MenuItem[] = [
    {label: 'Product Sales', icon: 'pi pi-chart-line', routerLink: 'reports/product-sales'},
    {label: 'Product Purchases', icon: 'pi pi-truck', routerLink: 'reports/product-purchases'},
    {label: 'Payments', icon: 'pi pi-dollar', routerLink: 'reports/payments'},
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
      {label: 'Reports', items: this.reportsMenuItems},
      {separator: true},
      {label: 'Admin Section', items: this.adminSectionMenuItems},
      {separator: true}
    ]
  })

  ngOnInit(): void {
    this.locationMembershipUserService.fetch()
    this.orgMembershipUserService.fetch()
  }
}
