import {UpperCasePipe} from '@angular/common'
import {Component, computed, effect, inject, OnInit, signal} from '@angular/core'
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router'
import {Button} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {TabsModule} from 'primeng/tabs'
import {distinctUntilChanged, map} from 'rxjs'
import {tap} from 'rxjs/operators'
import {Organization} from '../../../../api/organization/organization.model'
import {LocalStorageService} from '../../../../utils/services/local-storage.service'
import {LocalStorageKey} from '../../../../utils/types/local-storage-key.enum'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {OrgManagementNavigationComponent} from '../../org-management-navigation/org-management-navigation.component'
import {OrganizationService} from '../../../../api/organization/organization.service'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'

@Component({
  selector: 'rts-organization-dashboard',
  templateUrl: 'organization-dashboard.component.html',
  imports: [
    CardModule,
    TabsModule,
    RouterLink,
    RouterOutlet,
    Button,
    UpperCasePipe,
    OrgManagementNavigationComponent
  ]
})
export class OrganizationDashboardComponent extends HasSubscriptionComponent implements OnInit {
  private readonly organizationService = inject(OrganizationService)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)

  readonly subdomain = signal<string|null>(null)
  readonly activeTab = signal<'select-location' | 'manage'>('select-location')
  readonly currentOrganization = signal<Organization|null>(null)
  readonly isNavigationExpanded = signal(true)
  readonly showNavigation = computed(() => this.activeTab() === 'manage' && this.isNavigationExpanded())

  readonly organizationProcessingStatus = this.organizationService.selectProcessingStatus

  readonly ProcessingStatus = ProcessingStatus

  constructor() {
    super()
    effect(() => {
      if (this.organizationProcessingStatus() === ProcessingStatus.SUCCESS) {
        this.currentOrganization.set(this.organizationService.selectFirst() ?? null)
      }
    })
  }

  ngOnInit() {
    this.setInitialActiveTab()
    this.subscriptions.add(this.listenToActiveTab())
    this.subscriptions.add(this.listenToSubdomain())
    this.currentOrganization.set(this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION))
  }

  private setInitialActiveTab() {
    const initialPath = this.activatedRoute.firstChild?.snapshot.url[0]?.path
    if (initialPath) {
      this.activeTab.set(initialPath === 'manage' ? 'manage' : 'select-location')
    }
  }

  private listenToActiveTab() {
    return this.router.events.pipe(
      map(() => this.activatedRoute.firstChild?.snapshot.url[0]?.path),
      distinctUntilChanged(),
      tap(path => this.activeTab.set(path === 'manage' ? 'manage' : 'select-location'))
    ).subscribe()
  }

  toggleNavigationExpanded() {
    this.isNavigationExpanded.update(value => !value)
  }

  private listenToSubdomain() {
    return this.activatedRoute.paramMap.pipe(
      map(params => params.get('subdomain')),
      distinctUntilChanged(),
      tap(subdomain => this.subdomain.set(subdomain))
    ).subscribe()
  }

  returnToLandingPage() {
    this.localStorageService.removeItem(LocalStorageKey.ORGANIZATION)
    this.localStorageService.removeItem(LocalStorageKey.LOCATION)
    this.router.navigate(['/landing']).then()
  }
}
