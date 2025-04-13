import {Injectable} from '@angular/core'

@Injectable({providedIn: 'root'})
export class LocalStorageService {
    private readonly storage: Storage = localStorage

    setItem<T>(key: string, value: T): void {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
        this.storage.setItem(key, stringValue)
    }

    getItem<T>(key: string): T | null {
        const value = this.storage.getItem(key)
        if (value === null) return null

        try {
            return JSON.parse(value) as T
        } catch {
            return value as T
        }
    }

    removeItem(key: string): void {
        this.storage.removeItem(key)
    }

    clear(): void {
        this.storage.clear()
    }
}
