import {HttpErrorResponse} from '@angular/common/http'
import {TestBed} from '@angular/core/testing'
import {Router} from '@angular/router'
import {AuthenticationService} from '../../../api/platform-level/authentication/authentication.service'
import {RtsGoogleAuthService} from '../../../utils/services/auth/rts-google-auth.service'
import {SessionReauthenticationService} from '../../../utils/services/auth/session-reauthentication.service'
import {UserContextService} from '../../../utils/services/auth/user-context.service'
import {SessionExpiredDialogComponent} from './session-expired-dialog.component'

describe('SessionExpiredDialogComponent', () => {
  let googleAuthService: {initialize: jasmine.Spy}
  let authenticationService: {logInWithGoogle: jasmine.Spy; replaceLoginResponse: jasmine.Spy}
  let userContextService: {signOut: jasmine.Spy}
  let router: {navigate: jasmine.Spy}
  let sessionReauthenticationService: SessionReauthenticationService

  const createComponent = () => TestBed.runInInjectionContext(() => new SessionExpiredDialogComponent())

  beforeEach(() => {
    googleAuthService = {initialize: jasmine.createSpy('initialize').and.resolveTo()}
    authenticationService = {
      logInWithGoogle: jasmine.createSpy('logInWithGoogle'),
      replaceLoginResponse: jasmine.createSpy('replaceLoginResponse')
    }
    userContextService = {signOut: jasmine.createSpy('signOut')}
    router = {navigate: jasmine.createSpy('navigate').and.resolveTo(true)}

    TestBed.configureTestingModule({
      providers: [
        {provide: RtsGoogleAuthService, useValue: googleAuthService},
        {provide: AuthenticationService, useValue: authenticationService},
        {provide: UserContextService, useValue: userContextService},
        {provide: Router, useValue: router}
      ]
    })
    sessionReauthenticationService = TestBed.inject(SessionReauthenticationService)
  })

  it('replaces the stored login and completes the waiting requests on success', () => {
    const component = createComponent()
    sessionReauthenticationService.requestSignIn().subscribe()
    component.showGoogleButton()
    const onCredential = googleAuthService.initialize.calls.mostRecent().args[1] as (credential: string) => void

    onCredential('google-credential')

    const callbacks = authenticationService.logInWithGoogle.calls.mostRecent().args[1] as {onSuccess: (loginResponse: unknown) => void}
    expect(authenticationService.logInWithGoogle).toHaveBeenCalledOnceWith('google-credential', jasmine.any(Object))
    const loginResponse = {sessionToken: 'new-token'}
    callbacks.onSuccess(loginResponse)
    expect(authenticationService.replaceLoginResponse).toHaveBeenCalledOnceWith(loginResponse as never)
    expect(sessionReauthenticationService.awaitingSignIn()).toBeFalse()
  })

  it('shows the failure and keeps the prompt open when sign-in fails', () => {
    const component = createComponent()
    sessionReauthenticationService.requestSignIn().subscribe()
    component.showGoogleButton()
    const onCredential = googleAuthService.initialize.calls.mostRecent().args[1] as (credential: string) => void

    onCredential('google-credential')

    const callbacks = authenticationService.logInWithGoogle.calls.mostRecent().args[1] as {onFail: (error: HttpErrorResponse) => void}
    callbacks.onFail(new HttpErrorResponse({status: 401}))
    expect(component.errorMessage()).toBeTruthy()
    expect(sessionReauthenticationService.awaitingSignIn()).toBeTrue()
  })

  it('cancels the waiting requests, signs out and goes to the logged-out page on log out', () => {
    const component = createComponent()
    let cancelled = false
    sessionReauthenticationService.requestSignIn().subscribe({error: () => cancelled = true, next: signedIn => cancelled = !signedIn})

    component.logOut()

    expect(cancelled).toBeTrue()
    expect(userContextService.signOut).toHaveBeenCalledTimes(1)
    expect(router.navigate).toHaveBeenCalledTimes(1)
  })
})
