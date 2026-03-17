import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {JurisdictionType} from './jurisdiction-type.model'

@Injectable({providedIn: 'root'})
export class JurisdictionTypeStore extends createBaseStore<JurisdictionType>() implements BaseStore<JurisdictionType> {
  readonly basePath = 'jurisdiction-types'
}
