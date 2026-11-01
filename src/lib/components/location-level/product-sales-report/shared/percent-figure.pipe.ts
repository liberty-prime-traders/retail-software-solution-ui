import {formatNumber} from '@angular/common'
import {inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core'
import {isNil} from 'lodash-es'

/** Takes percent units (11.6), not a fraction, so Angular's percent pipe does not apply. */
@Pipe({name: 'percentFigure', standalone: true})
export class PercentFigurePipe implements PipeTransform {
  private readonly locale = inject(LOCALE_ID)

  transform(value: number | null | undefined): string {
    return isNil(value) ? '--' : `${formatNumber(value, this.locale, '1.1-1')}%`
  }
}
