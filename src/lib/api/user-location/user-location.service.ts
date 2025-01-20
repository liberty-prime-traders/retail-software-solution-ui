import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {UserLocationRequest, UserLocationResponse} from './user-location.model'
import {UserLocationQuery} from './user-location.query'
import {UserLocationState} from './user-location.state'
import {UserLocationStore} from './user-location.store'

@Injectable({providedIn: 'root'})
export class UserLocationService extends BaseService<UserLocationResponse, UserLocationState, UserLocationRequest>{
	
	constructor(protected override readonly store: UserLocationStore,
	            protected override readonly query: UserLocationQuery) {
		super(store, query)
	}
	
}
