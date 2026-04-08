import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {OrganizationFeature} from './org-feature.model'

@Injectable({providedIn: 'root'})
export class OrgFeatureStore extends createBaseStore<OrganizationFeature>() implements BaseStore<OrganizationFeature> {
  readonly basePath = 'org-features'
}
