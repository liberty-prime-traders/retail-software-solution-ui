import {DestroyRef, inject, Injectable, signal} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {NavigationEnd, Router} from '@angular/router'
import {tap} from 'rxjs/operators'
import {LOGGED_OUT_ROUTE} from '../../../app/app.routes'
import {LocalStorageKey} from '../types/local-storage-key.enum'
import {LocalStorageService} from './local-storage.service'

@Injectable({providedIn: 'root'})
export class RoutingContextService {
  private readonly router = inject(Router)
  private readonly localStorageService = inject(LocalStorageService)

  private readonly returnTo = signal<string|null>(null)

  private readonly respondToNavigation$ = this.router.events.pipe(
    tap((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects
        if (!url.includes(LOGGED_OUT_ROUTE) && url != '/') {
          this.returnTo.set(event.urlAfterRedirects)
          this.localStorageService.setItem(LocalStorageKey.RETURN_TO_URL, url)
        }
      }
    }),
    takeUntilDestroyed(inject(DestroyRef))
  )

  constructor() {
    this.respondToNavigation$.subscribe()
  }

  private getReturnToUrl(): string | null {
    return this.returnTo() ?? this.localStorageService.getItem<string>(LocalStorageKey.RETURN_TO_URL)
  }

  hasReturnTo(): boolean {
    return !!this.getReturnToUrl()
  }

  navigateToReturnTo(fallback = '/'): void {
    const returnTo = this.getReturnToUrl() ?? fallback
    this.router.navigateByUrl(returnTo).then()
  }
}
