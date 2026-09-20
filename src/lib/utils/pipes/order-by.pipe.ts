import {Pipe, PipeTransform} from '@angular/core'
import {orderBy} from 'lodash-es'

@Pipe({name: 'orderBy', standalone: true})
export class OrderByPipe implements PipeTransform {
  transform<T>(value: T[] | null | undefined, key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
    if (!value) {
      return []
    }
    return orderBy(value, [key], [direction])
  }
}
