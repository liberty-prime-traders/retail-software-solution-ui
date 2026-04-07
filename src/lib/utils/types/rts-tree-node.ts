import {EntityId} from '@ngrx/signals/entities'
import {TreeNode} from 'primeng/api'
import {BaseModel} from '../../api/util/base-api/base.model'

export namespace RtsTreeNode {

  export declare type EntityTreeNode = TreeNode<never> & BaseModel & {
    key: EntityId
  }

  export const TREE_NODE_ID_SELECTOR = (node: EntityTreeNode) => node.key
}
