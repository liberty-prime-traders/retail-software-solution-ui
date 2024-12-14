import {inject, Injectable} from '@angular/core'
import {Router} from '@angular/router'
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular'
import {AuthState} from '@okta/okta-auth-js'
import {filter, map} from 'rxjs'

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
		await this.oktaAuth.signInWithRedirect().then(_ => this.router.navigate(['']))
	}
	
	async signOut(): Promise<void> { await this.oktaAuth.signOut() }
	
}
