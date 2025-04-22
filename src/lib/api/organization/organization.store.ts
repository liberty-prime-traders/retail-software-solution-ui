import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {Organization} from './organization.model'

@Injectable({providedIn: 'root'})
export class OrganizationStore extends createBaseStore<Organization>() implements BaseStore<Organization> {
  readonly basePath = 'organizations'
}
