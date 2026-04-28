import {DatePipe} from '@angular/common'
import {inject, Pipe, PipeTransform} from '@angular/core'
import {ianaToAngularOffset} from '../dates'
import {UserContextService} from '../services/user-context.service'

@Pipe({ name: 'timezoneAwareDate', pure: false, standalone: true })
export class TimezoneAwareDatePipe implements PipeTransform {
  private readonly datePipe = inject(DatePipe)
  private readonly userContext = inject(UserContextService)

  transform(value: Date | string | number, format = 'medium'): string | null {
    const offset = ianaToAngularOffset(this.userContext.selectedTimezone())
    return this.datePipe.transform(value, format, offset)
  }
}
