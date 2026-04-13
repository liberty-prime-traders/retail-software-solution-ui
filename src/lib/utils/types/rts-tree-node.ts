import {EntityId} from '@ngrx/signals/entities'
import {TreeNode} from 'primeng/api'
import {BaseModel} from '../../api/util/base-api/base.model'

export namespace RtsTreeNode {

  export declare type EntityTreeNode<T = never> = TreeNode<T> & BaseModel & {
    key: EntityId
  }

  export const TREE_NODE_ID_SELECTOR = <T>(node: EntityTreeNode<T>) => node.key

  export const findNode = <T>(key?: string, nodes?: TreeNode<T>[]): TreeNode<T> | null => {
    if (!key || !nodes || nodes.length <= 0) {
      return null
    }
    const result = nodes.find(node => node.key === key)
    if (result) {
      return result
    }
    for (const node of nodes) {
      const foundInChildren = findNode(key, node.children ?? [])
      if (foundInChildren) {
        return foundInChildren
      }
    }
    return null
  }
}
