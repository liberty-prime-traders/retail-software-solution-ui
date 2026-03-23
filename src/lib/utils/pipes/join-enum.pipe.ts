import {Pipe, PipeTransform} from '@angular/core'
import {PrettifyEnumPipe} from './prettify-enum.pipe'

@Pipe({
  name: 'joinEnum', standalone: true
})
export class JoinEnumPipe implements PipeTransform {

  transform(values: string[] | null | undefined): string {
    if (!values?.length) return '--'
    return values
      .map(v => PrettifyEnumPipe.prototype.transform(v))
      .join(', ')
  }
}
