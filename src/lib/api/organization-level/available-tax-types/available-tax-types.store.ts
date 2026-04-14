import {Injectable} from '@angular/core'
import {RtsTreeNode} from '../../../utils/types/rts-tree-node'
import {TaxRecoveryType} from '../../platform-level/tax-type/tax-recovery-type.enum'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'

@Injectable({providedIn: 'root'})
export class AvailableTaxTypesStore
  extends createBaseStore<RtsTreeNode.EntityTreeNode<TaxRecoveryType>>(RtsTreeNode.TREE_NODE_ID_SELECTOR)
  implements BaseStore<RtsTreeNode.EntityTreeNode<TaxRecoveryType>> {

  readonly basePath = 'org-tax-types/available'

}
