import {Pipe} from '@angular/core'

@Pipe({name: 'booleanToText', standalone: true})
export class BooleanToTextPipe {
  transform(value: boolean | null | undefined): string {
    if (value === null || value === undefined) {
      return '--'
    }
    return value ? 'Yes' : 'No'
  }
}
