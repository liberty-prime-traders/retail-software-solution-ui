import {UpperCasePipe} from '@angular/common'
import {Component, effect, inject, OnInit, signal} from '@angular/core'
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from '@angular/router'
import {Button} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {MenubarModule} from 'primeng/menubar'
import {TabsModule} from 'primeng/tabs'
import {distinctUntilChanged, map} from 'rxjs'
import {tap} from 'rxjs/operators'
import {Organization} from '../../../../api/organization/organization.model'
import {OrganizationService} from '../../../../api/organization/organization.service'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'

@Component({
  selector: 'rts-organization-dashboard',
  templateUrl: 'organization-dashboard.component.html',
  imports: [
    CardModule,
    TabsModule,
    RouterOutlet,
    Button,
    UpperCasePipe,
    MenubarModule,
    RouterLink
  ]
})
export class OrganizationDashboardComponent extends HasSubscriptionComponent implements OnInit {
  private readonly organizationService = inject(OrganizationService)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)

  readonly subdomain = signal<string|null>(null)
  readonly activeTab = signal<'select-location' | 'manage'>('select-location')
  readonly currentOrganization = signal<Organization|null>(null)
  

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
    this.currentOrganization.set(this.sessionContextService.selectedOrganization())
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
  
  private listenToSubdomain() {
    return this.activatedRoute.paramMap.pipe(
      map(params => params.get('subdomain')),
      distinctUntilChanged(),
      tap(subdomain => this.subdomain.set(subdomain))
    ).subscribe()
  }

  returnToLandingPage() {
    this.sessionContextService.clearSessionContext()
    this.router.navigate(['/landing']).then()
  }
}
