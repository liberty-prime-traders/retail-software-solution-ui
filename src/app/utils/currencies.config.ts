import {InjectionToken} from '@angular/core'
import {LocalStorageKey} from '../../lib/utils/types/local-storage-key.enum'

export const CURRENCY = new InjectionToken('CURRENCY', {
  providedIn: 'root',
  factory: () => localStorage.getItem(LocalStorageKey.CURRENCY) ?? 'KES ',
})
