import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'isEmptyObject',
  standalone: true
})
export class IsEmptyObjectPipe implements PipeTransform {
  transform(value: any): boolean {
    return value && Object.keys(value).length === 0
  }
}
