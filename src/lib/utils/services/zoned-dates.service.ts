import {inject, Injectable} from '@angular/core'
import {TIMEZONE_TOKEN} from '../../api/util/timezone.model'

@Injectable({providedIn: 'root'})
export class ZonedDatesService {

  private readonly timeZone = inject(TIMEZONE_TOKEN)

  fromUTCToZonedDate = (utc?: string | Date | null): Date | null => {
    if (!utc) return null

    const date = typeof utc === 'string' ? new Date(utc) : utc
    const parts = this.getDateParts(date)
    const get = (type: string) => Number(parts.find(p => p.type === type)?.value ?? 0)
    return new Date(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'))
  }

  toZonedISOString = (date?: Date | null): string => {
    if (!date) return ''

    const parts = this.getDateParts(date)
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00'

    // '2026-04-29T23:00:00'
    const localISO = `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`

    const offset = this.getOffsetFromDate(date)
    const offsetWithColon = offset.slice(0, 3) + ':' + offset.slice(3)

    // '2026-04-29T23:00:00+03:00'
    return `${localISO}${offsetWithColon}`
  }

  getOffsetFromDate = (date: Date | string | number = new Date()): string => {
    const dateObj = date instanceof Date ? date : new Date(date)
    const parts = this.getDateParts(dateObj)

    // 'GMT+3' or 'GMT-5'
    const gmt = parts.find(p => p.type === 'timeZoneName')?.value

    const match = gmt?.match(/GMT([+-])(\d+)(:(\d+))?/)
    if (!match) return '+0000'

    const sign = match[1]
    const hours = match[2].padStart(2, '0')
    const minutes = (match[4] ?? '00').padStart(2, '0')

    // '+0300', '-0600'
    return `${sign}${hours}${minutes}`
  }

  private getDateParts = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: this.timeZone,
      timeZoneName: 'shortOffset',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).formatToParts(date)
}


