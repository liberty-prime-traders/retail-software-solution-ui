import {CommonModule} from '@angular/common'
import {Component, inject, OnDestroy, OnInit} from '@angular/core'
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router'
import {Organization} from 'lib/api/organization/organization.model'
import {LocalStorageService} from 'lib/utils/services/local-storage.service'
import {LocalStorageKey} from 'lib/utils/types/local-storage-key.enum'
import {CardModule} from 'primeng/card'
import {Tab, TabList, TabPanels, Tabs, TabsModule} from 'primeng/tabs'
import {distinctUntilChanged, filter, map, Subject, takeUntil} from 'rxjs'

@Component({
  standalone: true,
  selector: 'rts-organization-dashboard',
  templateUrl: 'organization-dashboard.component.html',
  imports: [
    CommonModule,
    CardModule,
    TabsModule,
    RouterLink,
    RouterOutlet
  ]
})
export class OrganizationDashboardComponent implements OnInit, OnDestroy {
  activeTab: 'locations' | 'manage' = 'locations'
  private destroy$ = new Subject<void>()

  private localStorageService = inject(LocalStorageService)
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router)

  subdomain: string | null = null;
  currentOrganization: Organization | null = null;

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute?.firstChild?.snapshot.url.map(segment => segment.path).join('/')),
      takeUntil(this.destroy$)
    ).subscribe(path => {
      if (path === 'locations') {
        this.activeTab = 'locations'
      } else if (path === 'manage') {
        this.activeTab = 'manage'
      } else {
        this.activeTab = 'locations'
      }
    })
  
    this.activatedRoute.firstChild?.url.pipe(
      map(urlSegments => urlSegments[0]?.path),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(path => {
      this.activeTab = path === 'manage' ? 'manage' : 'locations';
    })

    this.activatedRoute.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.subdomain = params.get('subdomain');
    })

    this.currentOrganization = this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION)
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}