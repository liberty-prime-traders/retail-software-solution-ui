import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Jurisdiction} from './jurisdiction.model'

@Injectable({providedIn: 'root'})
export class JurisdictionStore extends createBaseStore<Jurisdiction>() implements BaseStore<Jurisdiction> {
  readonly basePath = 'jurisdictions'
}
