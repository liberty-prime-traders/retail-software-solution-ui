import {HttpErrorResponse} from '@angular/common/http'
import {AfterViewInit, Component, inject} from '@angular/core'
import {MessageService} from 'primeng/api'
import {SECURE_ROUTE} from '../../../../app/app.routes'
import {
  AUTH_FAILURE_MESSAGES,
  AuthFailure,
  DEFAULT_AUTH_FAILURE_MESSAGE
} from '../../../api/platform-level/authentication/auth-failure.model'
import {AuthenticationService} from '../../../api/platform-level/authentication/authentication.service'
import {RtsGoogleAuthService} from '../../../utils/services/auth/rts-google-auth.service'
import {RoutingContextService} from '../../../utils/services/routing-context.service'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'

@Component({
  selector: 'rts-google-auth',
  template: `
    <div [id]="AUTH_BUTTON_ID"></div>
  `
})
export class GoogleAuthComponent implements AfterViewInit {

  readonly AUTH_BUTTON_ID = 'googleAuthButton'
  readonly ProcessingStatus = ProcessingStatus

  private readonly messageService = inject(MessageService)
  private readonly googleAuthService = inject(RtsGoogleAuthService)
  private readonly authenticationService = inject(AuthenticationService)
  private readonly routingContextService = inject(RoutingContextService)

  async ngAfterViewInit() {
    await this.googleAuthService.initialize(
      this.getAuthButton(),
      credential => this.logInWithGoogle(credential),
    )
  }

  private getAuthButton() {
    return document.getElementById(this.AUTH_BUTTON_ID)!
  }

  private readonly logInWithGoogle = (credential: string) => {
    this.authenticationService.logInWithGoogle(
      credential,
      {
        onFail: error => this.showFailureToast(error),
        onSuccess: () => this.routingContextService.navigateToReturnTo(SECURE_ROUTE)
      }
    )
  }

  private showFailureToast(error: HttpErrorResponse): void {
    const failure = error.error?.body as AuthFailure | undefined
    const message = failure?.code ? AUTH_FAILURE_MESSAGES[failure.code] : DEFAULT_AUTH_FAILURE_MESSAGE
    this.messageService.add({severity: 'error', summary: message.summary, detail: message.detail})
  }
}
