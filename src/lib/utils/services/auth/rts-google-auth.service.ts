import {inject, Injectable, signal} from '@angular/core'
import {environment} from '@environments/environment'
import {CredentialResponse} from 'google-one-tap'
import {LocalStorageService} from '../local-storage.service'
import {LocalStorageKey} from '../../types/local-storage-key.enum'

@Injectable({providedIn: 'root'})
export class RtsGoogleAuthService {
  private static readonly CLIENT_ID = environment.GOOGLE_CLIENT_ID

  // TODO: swap localStorage for a Cookie ASAP - localStorage is not appropriate for storing auth credentials
  private readonly localStorageService = inject(LocalStorageService)

  private readonly _storedCredential = signal<string | null>(
    this.localStorageService.getItem<string>(LocalStorageKey.GOOGLE_CREDENTIAL)
  )
  readonly storedCredential = this._storedCredential.asReadonly()

  async initialize(
    button: HTMLElement,
    onCredential: (credential: string) => void
  ): Promise<void> {
    await this.waitForGoogle()

    // @ts-ignore
    window.google.accounts.id.initialize({
      // @ts-ignore
      use_fedcm_for_button: true,
      button_auto_select: true,
      client_id: RtsGoogleAuthService.CLIENT_ID,
      callback: (response: CredentialResponse) => {
        this.setStoredCredential(response.credential)
        onCredential(response.credential)
      },
    })

    // @ts-ignore
    window.google.accounts.id.renderButton(button, {
      type: 'standard',
      shape: 'pill',
      theme: 'outline',
      text: 'continue_with',
      size: 'large',
      logo_alignment: 'left'
    })
  }

  clearStoredCredential(): void {
    this._storedCredential.set(null)
    this.localStorageService.removeItem(LocalStorageKey.GOOGLE_CREDENTIAL)
  }

  private setStoredCredential(credential: string): void {
    this._storedCredential.set(credential)
    this.localStorageService.setItem(LocalStorageKey.GOOGLE_CREDENTIAL, credential)
  }

  private waitForGoogle(timeout = 10_000): Promise<void> {
    // @ts-ignore
    if (window.google?.accounts?.id) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Google Identity Services failed to load'))
      }, timeout)

      // @ts-ignore
      window.onGoogleLibraryLoad = () => {
        clearTimeout(timer)
        resolve()
      }
    })
  }
}
