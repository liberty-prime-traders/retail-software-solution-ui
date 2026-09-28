import {Pipe, PipeTransform} from '@angular/core'

export interface TruncatedList {
  items: string[]
  remaining: number
}

@Pipe({
  name: 'truncatedList',
  standalone: true
})
export class TruncatedListPipe implements PipeTransform {
  transform(items: string[] | string | undefined, showCount: number): TruncatedList {
    if (!items) {
      return {
        items: [],
        remaining: 0
      }
    }
    const itemArray = Array.isArray(items) ? items : [items]
    return {
      items: itemArray.slice(0, showCount),
      remaining: Math.max(itemArray.length - showCount, 0)
    }
  }
}
