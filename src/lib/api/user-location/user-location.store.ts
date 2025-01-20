import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {createInitialState} from '../base-api/base.state'
import {BaseStore} from '../base-api/base.store'
import {UserLocationResponse} from './user-location.model'
import {UserLocationState} from './user-location.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'user-location', idKey: 'locationId'})
export class UserLocationStore extends BaseStore<UserLocationResponse, UserLocationState> {
	
	constructor() {
		super(createInitialState())
	}
	
}
