import {Injectable} from '@angular/core'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {UnitValue} from './unitvalue.model'
import {UnitValueStore} from './unitvalue.store'

@Injectable({providedIn: 'root'})
export class UnitValueService extends MultimapBaseService<UnitValue> {

  protected override keyPath: keyof UnitValue = 'unitGroupId'

  constructor(protected override readonly store: UnitValueStore) {
    super(store)
  }

}
