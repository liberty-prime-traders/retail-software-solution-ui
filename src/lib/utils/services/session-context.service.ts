import {inject, Injectable, signal} from '@angular/core'
import {Organization} from '../../api/organization/organization.model'
import {Location} from '../../api/location/location.model'
import {LocalStorageKey} from '../types/local-storage-key.enum'
import {LocalStorageService} from './local-storage.service'

@Injectable({providedIn: 'root'})
export class SessionContextService {
	
	private readonly localStorageService = inject(LocalStorageService)
	
	readonly selectedOrganization = signal<Organization|null>(null)
	readonly selectedLocation = signal<Location|null>(null)
	
	updateSelectedOrganization(organization: Organization|null): void {
		this.selectedOrganization.set(organization)
		this.localStorageService.setItem(LocalStorageKey.ORGANIZATION, organization)
	}
	
	updateSelectedLocation(location: Location|null): void {
		this.selectedLocation.set(location)
		this.localStorageService.setItem(LocalStorageKey.LOCATION, location)
	}
	
	clearSelectedOrganization(): void {
		this.selectedOrganization.set(null)
		this.localStorageService.removeItem(LocalStorageKey.ORGANIZATION)
	}
	
	clearSelectedLocation(): void {
		this.selectedLocation.set(null)
		this.localStorageService.removeItem(LocalStorageKey.LOCATION)
	}
	
	clearSessionContext(): void {
		this.clearSelectedOrganization()
		this.clearSelectedLocation()
	}
}
