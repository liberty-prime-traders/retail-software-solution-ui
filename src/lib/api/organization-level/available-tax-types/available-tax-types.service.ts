import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {RtsTreeNode} from '../../../utils/types/rts-tree-node'
import {TaxRecoveryType} from '../../platform-level/tax-type/tax-recovery-type.enum'
import {FetchService} from '../../util/base-api/fetch-service'
import {AvailableTaxTypesStore} from './available-tax-types.store'

@Injectable({providedIn: 'root'})
export class AvailableTaxTypesService extends FetchService<RtsTreeNode.EntityTreeNode<TaxRecoveryType>> {

  constructor(protected override readonly store: AvailableTaxTypesStore) {
    super(store, inject(HttpClient))
  }
}
