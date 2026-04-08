import {Component, computed, inject, OnInit, signal, Signal} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Menu} from 'primeng/menu'
import {OrgFeatureService} from '../../api/organization-level/org-feature/org-feature.service'
import {SessionContextService} from '../../utils/services/session-context.service'

@Component({
  selector: 'rts-manage-organization',
  templateUrl: 'organization-dashboard.component.html',
  imports: [
    RouterOutlet,
    Menu,
    Card,
    Button
  ]
})
export class OrganizationDashboardComponent implements OnInit {
  private readonly sessionContextService = inject(SessionContextService)
  private readonly orgFeatureService = inject(OrgFeatureService)

  private readonly organizationHomeMenuItems: MenuItem[] = [
    {label: 'Summary', icon: 'pi pi-home', routerLink: 'summary'}
  ]

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
  ]

  private readonly financialSettingsMenuItems: Signal<MenuItem[]> = computed(() => {
    const showTaxes = this.orgFeatureService.isTaxEnabled()
    return [
      {
        label: 'Chart of Accounts',
        icon: 'pi pi-book',
        routerLink: 'chart-of-accounts',
        visible: this.orgFeatureService.isChartOfAccountsEnabled()
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

  private readonly productSettingsMenuItems: MenuItem[] = [
    {label: 'Product Categories', icon: 'pi pi-palette', routerLink: 'product-category'},
    {label: 'Product Groups', icon: 'pi pi-clone', routerLink: 'product-groups'},
    {label: 'Product Lines', icon: 'pi pi-objects-column', routerLink: 'products'}
  ]

  readonly menuItems: Signal<MenuItem[]> = computed(() => {
    const menuItems = [
      {label: 'Home', items: this.organizationHomeMenuItems},
      {label: 'Products', items: this.productSettingsMenuItems},
      {label: 'Business Settings', items: this.businessSettingsMenuItems},
    ]

    const financeItems = this.financialSettingsMenuItems()
    const showFinance = financeItems.some(item => item.visible !== false)
    if (showFinance) {
      menuItems.push({label: 'Finance', items:financeItems})
    }

    if (this.sessionContextService.loggedInUserIsOrganizationAdmin()) {
      menuItems.push({label: 'Admin Settings', items: this.orgAdminSettings})
    }

    return menuItems
  })

  readonly showMenu = signal(true)

  ngOnInit() {
    this.orgFeatureService.fetch()
  }
}
