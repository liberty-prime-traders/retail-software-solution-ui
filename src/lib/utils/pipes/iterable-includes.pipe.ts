import {Pipe} from '@angular/core'

@Pipe({
  name: 'includes',
  standalone: true
})
export class IterableIncludesPipe {
  transform<T>(value: T, iterable: Array<T> | Set<T> | string): boolean {
    for (const item of iterable) {
      if (item === value) {
        return true
      }
    }
    return false
  }
}
