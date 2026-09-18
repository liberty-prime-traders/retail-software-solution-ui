import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {LoginResponse} from './login.model'

@Injectable({providedIn: 'root'})
export class AuthenticationStore
  extends createBaseStore<LoginResponse>((entity) => entity.sessionToken)
  implements BaseStore<LoginResponse> {
  readonly basePath = 'auth'
}
