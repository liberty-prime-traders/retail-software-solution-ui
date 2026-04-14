import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {PlatformFeature} from './platform-feature.model'
import {PlatformFeatureStore} from './platform-feature.store'

@Injectable({providedIn: 'root'})
export class PlatformFeatureService extends BaseService<PlatformFeature> {

  constructor(protected override readonly store: PlatformFeatureStore) {
    super(store)
  }
}
