import {inject, Pipe, PipeTransform} from '@angular/core'
import {ZonedDatesService} from '../services/zoned-dates.service'

/**
 * For a Date from a date-picker form control, not a backend-sourced timestamp - see
 * ZonedDatesService.displayAtOrgZone for why those two need different treatment.
 */
@Pipe({name: 'orgDateTime', standalone: true})
export class OrgDateTimePipe implements PipeTransform {
  private readonly zonedDatesService = inject(ZonedDatesService)

  transform(value?: Date | null): string {
    return this.zonedDatesService.displayAtOrgZone(value)
  }
}
