import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {AuthorizationPass} from './authorization-pass.model'

@Injectable({providedIn: 'root'})
export class AuthorizationPassStore extends createBaseStore<AuthorizationPass>() implements BaseStore<AuthorizationPass> {
  readonly basePath = 'authorization-passes'
}
