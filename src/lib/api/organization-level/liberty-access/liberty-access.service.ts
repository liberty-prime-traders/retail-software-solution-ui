import {HttpClient} from '@angular/common/http'
import {computed, DestroyRef, inject, Injectable, NgZone, signal} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {fromEvent, interval, merge, Observable, of} from 'rxjs'
import {catchError, map, tap, throttleTime} from 'rxjs/operators'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {UserPermission} from '../../cross-tier/authorization/user-permission.enum'

const REFRESH_INTERVAL_MILLIS = 10 * 60 * 1000
const ACTIVITY_THROTTLE_MILLIS = 1000

@Injectable({providedIn: 'root'})
export class LibertyAccessService {
  private readonly httpClient = inject(HttpClient)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly ngZone = inject(NgZone)
  private readonly destroyRef = inject(DestroyRef)

  private readonly _libertyPermissions = signal<UserPermission[]>([])
  private loadedForOrganizationId: string | null = null
  private lastActivityAt = Date.now()
  private trackingStarted = false

  readonly isLibertyAdmin = computed(() =>  this._libertyPermissions().includes(UserPermission.LIBERTY_ADMIN))

  // Resolves once permissions for the selected organization are known, so route guards never read a stale list.
  ensureLoaded$(): Observable<void> {
    const organizationId = this.sessionContextService.selectedOrganization()?.id?.toString() ?? null
    if (organizationId === this.loadedForOrganizationId) {
      return of(undefined)
    }
    return this.refresh$()
  }

  refresh$(): Observable<void> {
    const organizationId = this.sessionContextService.selectedOrganization()?.id?.toString() ?? null
    this.startActivityTracking()
    if (organizationId !== this.loadedForOrganizationId) {
      this._libertyPermissions.set([])
    }
    if (!organizationId) {
      this.loadedForOrganizationId = null
      return of(undefined)
    }
    return this.httpClient.get<UserPermission[]>('/secured/liberty-permissions').pipe(
      catchError(() => of([] as UserPermission[])),
      tap(permissions => {
        this._libertyPermissions.set(permissions)
        this.loadedForOrganizationId = organizationId
      }),
      map(() => undefined)
    )
  }

  clear(): void {
    this._libertyPermissions.set([])
    this.loadedForOrganizationId = null
  }

  private startActivityTracking(): void {
    if (this.trackingStarted) return
    this.trackingStarted = true

    this.ngZone.runOutsideAngular(() => {
      merge(fromEvent(document, 'click'), fromEvent(document, 'keydown'), fromEvent(document, 'mousemove')).pipe(
        throttleTime(ACTIVITY_THROTTLE_MILLIS),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(() => this.lastActivityAt = Date.now())
    })

    interval(REFRESH_INTERVAL_MILLIS).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (Date.now() - this.lastActivityAt <= REFRESH_INTERVAL_MILLIS) {
        this.refresh$().subscribe()
      }
    })
  }
}
