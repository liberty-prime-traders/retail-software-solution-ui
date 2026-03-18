import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {Jurisdiction} from './jurisdiction.model'
import {JurisdictionStore} from './jurisdiction.store'

@Injectable({providedIn: 'root'})
export class JurisdictionService extends BaseService<Jurisdiction> {

  constructor(protected override readonly store: JurisdictionStore) {
    super(store)
  }
}
