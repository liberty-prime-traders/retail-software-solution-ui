import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'round'
})
export class RoundNumbersPipe implements PipeTransform {
  transform(value: number, digits: number = 0): number {
    const factor = Math.pow(10, digits)
    return Math.round(value * factor) / factor
  }
}
