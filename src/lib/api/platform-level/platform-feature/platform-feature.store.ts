import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {PlatformFeature} from './platform-feature.model'

@Injectable({providedIn: 'root'})
export class PlatformFeatureStore extends createBaseStore<PlatformFeature>() implements BaseStore<PlatformFeature> {

  readonly basePath = 'platform-features'
}
