import {Injectable} from '@angular/core'
import {RtsTreeNode} from '../../../utils/types/rts-tree-node'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'

@Injectable({providedIn: 'root'})
export class AvailableTaxTypesStore extends createBaseStore<RtsTreeNode.EntityTreeNode>(RtsTreeNode.TREE_NODE_ID_SELECTOR)
  implements BaseStore<RtsTreeNode.EntityTreeNode> {

  readonly basePath = 'org-tax-types/available'

}
