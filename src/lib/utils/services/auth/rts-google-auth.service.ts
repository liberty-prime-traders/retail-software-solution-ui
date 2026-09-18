import {Injectable} from '@angular/core'
import {CredentialResponse} from 'google-one-tap'

@Injectable({providedIn: 'root'})
export class RtsGoogleAuthService {
  private static readonly CLIENT_ID = '1041984457184-rk441ulgoosac3l6k9neifd3hh6g5ikd.apps.googleusercontent.com'

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
      callback: (response: CredentialResponse) => onCredential(response.credential),
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
