import {Injectable} from '@angular/core'
import {LocalStorageKey} from '../types/local-storage-key.enum'

@Injectable({providedIn: 'root'})
export class LocalStorageService {
  private readonly storage: Storage = localStorage

  setItem<T>(key: LocalStorageKey, value: T): void {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    this.storage.setItem(key, stringValue)
  }

  getItem<T>(key: LocalStorageKey): T | null {
    const value = this.storage.getItem(key)
    if (value === null) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  removeItem(key: LocalStorageKey): void {
    this.storage.removeItem(key)
  }

  clear(): void {
    this.storage.clear()
  }
}
