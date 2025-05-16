import {computed, Injectable, signal} from '@angular/core'

@Injectable({providedIn: 'root'})
export class RoutingContextService {
	private readonly _returnTo = signal<string|undefined>(undefined)
	readonly returnTo = computed(() => this._returnTo())
	
	registerReturnTo(returnTo?: string): void {
		this._returnTo.set(returnTo ?? window.location.pathname)
	}
	
	clearReturnTo(): void {
		this._returnTo.set(undefined)
	}
}
