import {inject, Injectable} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {Router} from '@angular/router'
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular'
import {AccessToken, AuthState} from '@okta/okta-auth-js'
import {filter, map, Observable, switchMap} from 'rxjs'
import {first} from 'rxjs/operators'
import {OktaAccessTokenClaims} from '../models/okta-access-token-claims.model'
import {UserRole} from '../types/user-role.enum'

@Injectable({providedIn: 'root'})
export class RtsOktaService {
  private readonly oktaAuth = inject(OKTA_AUTH)
  private readonly oktaStateService = inject(OktaAuthStateService)
  private readonly router = inject(Router)

  readonly loggedIn$ = this.oktaStateService.authState$.pipe(
    filter((s: AuthState) => Boolean(s)),
    map((s: AuthState) => s.isAuthenticated ?? false)
  )

  async signIn() : Promise<void> {
    await this.oktaAuth.signInWithRedirect().then(() => this.router.navigate(['']))
  }

  async signOut(): Promise<void> { await this.oktaAuth.signOut() }

  readonly accessToken$: Observable<AccessToken|undefined> = this.oktaStateService.authState$.pipe(
    map(authState => authState.accessToken),
    first()
  )

  hasRole$(role: UserRole): Observable<boolean> {
    return this.accessToken$.pipe(
      map(accessToken => this.hasRole(accessToken, role))
    )
  }

  private hasRole(accessToken: AccessToken|undefined, role: UserRole): boolean {
    const claims = (accessToken?.claims as OktaAccessTokenClaims)?.groups
    return Boolean(claims?.includes(role))
  }

  readonly isPlatformAdmin = toSignal(
    this.loggedIn$.pipe(
      filter((isLoggedIn) => Boolean(isLoggedIn)),
      switchMap(() => this.hasRole$(UserRole.ROLE_PLATFORM_ADMIN))
    ),
    {initialValue: false}
  )
}
