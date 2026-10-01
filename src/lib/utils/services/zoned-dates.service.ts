import {inject, Injectable} from '@angular/core'
import {TIMEZONE_TOKEN} from '@global/utils/timezones.config'

@Injectable({providedIn: 'root'})
export class ZonedDatesService {

  private readonly timeZone = inject(TIMEZONE_TOKEN)
  private static readonly shortMonthFormatter = new Intl.DateTimeFormat('en-US', {month: 'short'})

  atOrgZone = (date?: Date | null): string => {
    if (!date) return ''
    const pad = (n: number) => String(n).padStart(2, '0')
    const localYmd = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    const localTime = `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
    const offset = this.getOffsetFromDate(date)
    const offsetWithColon = offset.slice(0, 3) + ':' + offset.slice(3)
    return `${localYmd}${localTime}${offsetWithColon}`
  }

  displayAtOrgZone = (date?: Date | null): string => {
    if (!date) return ''
    const pad = (n: number) => String(n).padStart(2, '0')
    const month = ZonedDatesService.shortMonthFormatter.format(date)
    return `${date.getDate()} ${month} ${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
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


