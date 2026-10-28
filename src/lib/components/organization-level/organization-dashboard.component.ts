import {Component, computed, inject, OnInit, signal, Signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {OrgMembershipUserService} from '../../api/organization-level/membership/org-membership-user.service'
import {OrgFeatureService} from '../../api/organization-level/org-feature/org-feature.service'
import {UserContextService} from '../../utils/services/auth/user-context.service'
import {AutoStretchDirective} from '../reusable/auto-stretch.directive'
import {OrganizationLaunchService} from '../welcome/top-navigation/organization-nav-content/organization-launch.service'

@Component({
  selector: 'rts-manage-organization',
  templateUrl: 'organization-dashboard.component.html',
  imports: [
    RouterOutlet,
    Menu,
    Card,
    ButtonDirective,
    AutoStretchDirective
  ]
})
export class OrganizationDashboardComponent implements OnInit {
  private readonly userContextService = inject(UserContextService)
  private readonly orgFeatureService = inject(OrgFeatureService)
  private readonly organizationLaunchService = inject(OrganizationLaunchService)
  private readonly orgMembershipUserService = inject(OrgMembershipUserService)

  private readonly organizationHomeMenuItems: Signal<MenuItem[]> = computed(() => [
    {label: 'Summary', icon: 'pi pi-home', routerLink: 'summary'},
  ])

  private readonly orgAdminSettings: MenuItem[] = [
    {label: 'Locations', icon: 'pi pi-map-marker', routerLink: 'locations'},
    {label: 'Users', icon: 'pi pi-users', routerLink: 'users'},
    {label: 'Join Requests', icon: 'pi pi-users', routerLink: 'join-requests'},
    {label: 'Admins', icon: 'pi pi-lock', routerLink: 'admins'},
    {label: 'Org Profile', icon: 'pi pi-cog', routerLink: 'profile'},
    {label: 'Features', icon: 'pi pi-sliders-h', routerLink: 'features'}
  ]

  private readonly businessSettingsMenuItems: MenuItem[] = [
    {label: 'Contacts', icon: 'pi pi-address-book', routerLink: 'contacts'},
    {label: 'Job Titles', icon: 'pi pi-gauge', routerLink: 'job-title'},
    {label: 'Units', icon: 'pi pi-percentage', routerLink: 'units'},
    {label: 'Payment Options', icon: 'pi pi-dollar', routerLink: 'payment-options'},
    {label: 'Tags', icon: 'pi pi-tags', routerLink: 'tags'},
    {label: 'Stock Movement Reasons', icon: 'pi pi-arrow-right-arrow-left', routerLink: 'stock-movement-reasons'},
  ]

  private readonly productSettingsMenuItems: MenuItem[] = [
    {label: 'Product Categories', icon: 'pi pi-palette', routerLink: 'product-category'},
    {label: 'Product Groups', icon: 'pi pi-clone', routerLink: 'product-groups'},
    {label: 'Product Lines', icon: 'pi pi-objects-column', routerLink: 'products'}
  ]

  private readonly transactionsMenuItems: Signal<MenuItem[]> = computed(() => {
    const isChartOfAccountsEnabled = this.orgFeatureService.isChartOfAccountsEnabled()
    return [
      {
        label: 'Fund Transfers',
        icon: 'pi pi-money-bill',
        routerLink: 'fund-transfers',
        visible: isChartOfAccountsEnabled
      },
      {
        label: 'Loans',
        icon: 'pi pi-briefcase',
        routerLink: 'loans',
        visible: isChartOfAccountsEnabled
      }
    ]
  })

  private readonly financialSettingsMenuItems: Signal<MenuItem[]> = computed(() => {
    const showTaxes = this.orgFeatureService.isTaxEnabled()
    const isChartOfAccountsEnabled = this.orgFeatureService.isChartOfAccountsEnabled()
    return [
      {
        label: 'Chart of Accounts',
        icon: 'pi pi-book',
        routerLink: 'chart-of-accounts',
        visible: isChartOfAccountsEnabled
      },
      {
        label: 'Expense Types',
        icon: 'pi pi-wallet',
        routerLink: 'expense-types',
        visible: isChartOfAccountsEnabled
      },
      {
        label: 'Fiscal Periods',
        icon: 'pi pi-calendar',
        routerLink: 'fiscal-periods',
        visible: isChartOfAccountsEnabled
      },
      {
        label: 'Tax Types',
        icon: 'pi pi-receipt',
        routerLink: 'tax-types',
        visible: showTaxes
      },
      {
        label: 'Tax Rates',
        icon: 'pi pi-calculator',
        routerLink: 'tax-rates',
        visible: showTaxes
      },
    ]
  })

  private readonly reportingMenuItems: MenuItem[] = [
    {label: 'Snapshot', icon: 'pi pi-chart-bar', routerLink: 'daily-summary'}
  ]

  readonly menuItems: Signal<MenuItem[]> = computed(() => {
    if (!this.userContextService.isLibertyAdmin()) {
      return this.organizationHomeMenuItems()
    }

    const menuItems: MenuItem[] = [
      {label: 'Home', items: this.organizationHomeMenuItems()},
      {label: 'Products', items: this.productSettingsMenuItems},
      {separator: true},
      {label: 'Business Settings', items: this.businessSettingsMenuItems, expanded: true, toggleable: true},
      {separator: true},
    ]

    const transactionItems = this.transactionsMenuItems()
    const showTransactions = transactionItems.some(item => item.visible !== false)
    if (showTransactions) {
      menuItems.push({label: 'Transactions', items: transactionItems, expanded: false, toggleable: true})
    }

    menuItems.push({label: 'Reports', items: this.reportingMenuItems, expanded: false, toggleable: true})

    const financeItems = this.financialSettingsMenuItems()
    const showFinance = financeItems.some(item => item.visible !== false)
    if (showFinance) {
      menuItems.push({label: 'Finance', items:financeItems, expanded: false, toggleable: true})
    }

    if (this.userContextService.isOrganizationAdmin()) {
      menuItems.push({separator: true})
      menuItems.push({label: 'Admin Settings', toggleable: true, items: this.orgAdminSettings})
    }

    return menuItems
  })

  readonly showMenu = signal(true)

  ngOnInit() {
    this.orgFeatureService.fetch()
    this.orgMembershipUserService.fetch()
    this.organizationLaunchService.proceedToSelectedOrganization()
  }
}
