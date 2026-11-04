import {HttpErrorResponse} from '@angular/common/http'
import {Component, inject, signal} from '@angular/core'
import {Router} from '@angular/router'
import {ButtonModule} from 'primeng/button'
import {DialogModule} from 'primeng/dialog'
import {LOGGED_OUT_ROUTE} from '@global/app.routes'
import {
  AUTH_FAILURE_MESSAGES,
  AuthFailure,
  DEFAULT_AUTH_FAILURE_MESSAGE
} from '../../../api/platform-level/authentication/auth-failure.model'
import {AuthenticationService} from '../../../api/platform-level/authentication/authentication.service'
import {RtsGoogleAuthService} from '../../../utils/services/auth/rts-google-auth.service'
import {SessionReauthenticationService} from '../../../utils/services/auth/session-reauthentication.service'
import {UserContextService} from '../../../utils/services/auth/user-context.service'
import {RtsConstants} from '../../../utils/constants'

@Component({
  selector: 'rts-session-expired-dialog',
  imports: [ButtonModule, DialogModule],
  template: `
    <p-dialog header="Your session has ended"
              [visible]="awaitingSignIn()"
              [baseZIndex]="ZIndexes.DIALOG_BASE"
              [modal]="true"
              [closable]="false"
              [draggable]="false"
              [resizable]="false"
              appendTo="body"
              (onShow)="showGoogleButton()">
      <p>Sign in again to continue. Your data has not been lost</p>
      <div class="flex justify-content-between gap-1">
        <div class="w-fit" [id]="GOOGLE_BUTTON_ID"></div>
        @if (errorMessage()) {
          <p class="text-red-600">{{ errorMessage() }}</p>
        }
        <button pButton severity="danger" [text]="true" (click)="logOut()">Log Out</button>
      </div>

    </p-dialog>
  `
})
export class SessionExpiredDialogComponent {

  readonly GOOGLE_BUTTON_ID = 'sessionExpiredGoogleButton'
  readonly ZIndexes = RtsConstants.ZIndexes
  readonly errorMessage = signal<string | null>(null)

  private readonly sessionReauthenticationService = inject(SessionReauthenticationService)
  private readonly googleAuthService = inject(RtsGoogleAuthService)
  private readonly authenticationService = inject(AuthenticationService)
  private readonly userContextService = inject(UserContextService)
  private readonly router = inject(Router)

  readonly awaitingSignIn = this.sessionReauthenticationService.awaitingSignIn

  showGoogleButton(): void {
    this.errorMessage.set(null)
    this.googleAuthService.initialize(
      document.getElementById(this.GOOGLE_BUTTON_ID)!,
      credential => this.signIn(credential)
    ).catch(() => this.errorMessage.set('Google sign-in could not be loaded. Check your connection and try again.'))
  }

  logOut(): void {
    this.sessionReauthenticationService.cancelSignIn()
    this.userContextService.signOut()
    this.router.navigate([LOGGED_OUT_ROUTE]).then()
  }

  private signIn(credential: string): void {
    this.authenticationService.logInWithGoogle(credential, {
      onSuccess: loginResponse => {
        this.authenticationService.replaceLoginResponse(loginResponse)
        this.sessionReauthenticationService.completeSignIn()
      },
      onFail: error => this.errorMessage.set(this.failureMessageOf(error))
    })
  }

  private failureMessageOf(error: HttpErrorResponse): string {
    const failure = error.error?.body as AuthFailure | undefined
    const message = failure?.code ? AUTH_FAILURE_MESSAGES[failure.code] : DEFAULT_AUTH_FAILURE_MESSAGE
    return message.detail
  }
}
