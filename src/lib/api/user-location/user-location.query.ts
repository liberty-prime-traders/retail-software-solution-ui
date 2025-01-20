import {Injectable} from '@angular/core'
import {isNil} from 'lodash-es'
import {Observable, of} from 'rxjs'
import {BaseQuery} from '../base-api/base.query'
import {LocationUser, UserLocationResponse} from './user-location.model'
import {UserLocationState} from './user-location.state'
import {UserLocationStore} from './user-location.store'

@Injectable({providedIn: 'root'})
export class UserLocationQuery extends BaseQuery<UserLocationResponse, UserLocationState> {
	
	constructor(protected override readonly store: UserLocationStore) {
		super(store)
	}
	
	selectUsersForLocation(locationId?: string): Observable<LocationUser[]> {
		if (isNil(locationId)) {
			return of([])
		}
		return this.selectEntity(locationId, userLocation => userLocation?.users ?? [])
	}
	
}
