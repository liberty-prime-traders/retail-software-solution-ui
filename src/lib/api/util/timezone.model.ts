import {InjectionToken} from '@angular/core'
import {LocalStorageKey} from '../../utils/types/local-storage-key.enum'

export interface Timezone {
  label: string
  value: string
}

export const DEFAULT_TIMEZONE: Timezone = { label: 'Nairobi (EAT, UTC+3)', value: 'Africa/Nairobi' }

export const TIMEZONE_TOKEN = new InjectionToken<string>('TIMEZONE_TOKEN', {
  providedIn: 'root',
  factory: () => localStorage.getItem(LocalStorageKey.TIMEZONE) ?? DEFAULT_TIMEZONE.value
})

export const TIMEZONES = [
  // Africa
  DEFAULT_TIMEZONE,
  { label: 'Addis Ababa (EAT, UTC+3)', value: 'Africa/Addis_Ababa' },
  { label: 'Kampala (EAT, UTC+3)', value: 'Africa/Kampala' },
  { label: 'Dar es Salaam (EAT, UTC+3)', value: 'Africa/Dar_es_Salaam' },
  { label: 'Cairo (EET, UTC+2/+3)', value: 'Africa/Cairo' },
  { label: 'Lagos (WAT, UTC+1)', value: 'Africa/Lagos' },
  { label: 'Accra (GMT, UTC+0)', value: 'Africa/Accra' },
  { label: 'Abidjan (GMT, UTC+0)', value: 'Africa/Abidjan' },
  { label: 'Johannesburg (SAST, UTC+2)', value: 'Africa/Johannesburg' },
  { label: 'Casablanca (WET, UTC+0)', value: 'Africa/Casablanca' },

  // North America
  { label: 'Eastern (ET, UTC-5/-4)', value: 'America/New_York' },
  { label: 'Central (CT, UTC-6/-5)', value: 'America/Chicago' },
  { label: 'Mountain (MT, UTC-7/-6)', value: 'America/Denver' },
  { label: 'Pacific (PT, UTC-8/-7)', value: 'America/Los_Angeles' },
  { label: 'Alaska (AKT, UTC-9/-8)', value: 'America/Anchorage' },
  { label: 'Hawaii (HST, UTC-10)', value: 'Pacific/Honolulu' },
  { label: 'Atlantic (AT, UTC-4/-3)', value: 'America/Halifax' },
  { label: 'Mexico City (CST, UTC-6/-5)', value: 'America/Mexico_City' },
  { label: 'Toronto (ET, UTC-5/-4)', value: 'America/Toronto' },
  { label: 'Vancouver (PT, UTC-8/-7)', value: 'America/Vancouver' },
];
