import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {JurisdictionType} from './jurisdiction-type.model'
import {JurisdictionTypeStore} from './jurisdiction-type.store'

@Injectable({providedIn: 'root'})
export class JurisdictionTypeService extends BaseService<JurisdictionType> {

  constructor(protected override readonly store: JurisdictionTypeStore) {
    super(store)
  }
}
