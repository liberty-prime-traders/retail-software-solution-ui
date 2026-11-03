import {HttpErrorResponse, HttpHandler, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http'
import {signal} from '@angular/core'
import {TestBed} from '@angular/core/testing'
import {Observable, of, throwError} from 'rxjs'
import {AuthenticationService} from '../../lib/api/platform-level/authentication/authentication.service'
import {NavigationScope} from '../../lib/components/welcome/top-navigation/navigation-scope.model'
import {SessionReauthenticationService} from '../../lib/utils/services/auth/session-reauthentication.service'
import {UserContextService} from '../../lib/utils/services/auth/user-context.service'
import {SessionContextService} from '../../lib/utils/services/session-context.service'
import {RtsHttpInterceptor} from './rts-http.interceptor'

describe('RtsHttpInterceptor location header', () => {
  const selectedScope = signal(NavigationScope.ORG)
  const location = {id: 'loc-1'}
  let sentRequest: HttpRequest<unknown>

  const send = () => {
    const handler = {handle: (request: HttpRequest<unknown>) => { sentRequest = request; return of() }} as HttpHandler
    TestBed.inject(RtsHttpInterceptor).intercept(new HttpRequest('GET', '/secured/anything'), handler).subscribe()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RtsHttpInterceptor,
        {provide: UserContextService, useValue: {token: () => 'token'}},
        {
          provide: SessionContextService,
          useValue: {selectedScope, selectedOrganization: () => ({id: 'org-1'}), selectedLocation: () => location}
        },
        {provide: AuthenticationService, useValue: {renewSessionToken: () => {}}}
      ]
    })
  })

  it('sends the selected location only while the location scope is active', () => {
    selectedScope.set(NavigationScope.LOCATION)
    send()
    expect(sentRequest.headers.get('X-LOCATION-ID')).toBe('loc-1')

    selectedScope.set(NavigationScope.ORG)
    send()
    expect(sentRequest.headers.get('X-LOCATION-ID')).toBe('')
  })
})

describe('RtsHttpInterceptor session renewal and unauthorized retry', () => {
  let currentToken: string
  let userContextService: {token: () => string; signOut: jasmine.Spy}
  let authenticationService: {renewSessionToken: jasmine.Spy}
  let sessionReauthenticationService: SessionReauthenticationService
  let attemptedTokens: string[]

  // Rejects any request sent with `rejectedToken`, and answers everything else with 200.
  const rejectingToken = (rejectedToken: string): HttpHandler => ({
    handle: (request: HttpRequest<unknown>) => {
      attemptedTokens.push(request.headers.get('Authorization')!)
      return request.headers.get('Authorization') === `Bearer ${rejectedToken}`
        ? throwError(() => new HttpErrorResponse({status: 401}))
        : of(new HttpResponse({status: 200}))
    }
  })

  const interceptSecured = (handler: HttpHandler): Observable<unknown> =>
    TestBed.inject(RtsHttpInterceptor).intercept(new HttpRequest('GET', '/secured/anything'), handler)

  beforeEach(() => {
    currentToken = 'token'
    attemptedTokens = []
    userContextService = {
      token: () => currentToken,
      signOut: jasmine.createSpy('signOut')
    }
    authenticationService = {renewSessionToken: jasmine.createSpy('renewSessionToken')}

    TestBed.configureTestingModule({
      providers: [
        RtsHttpInterceptor,
        {provide: UserContextService, useValue: userContextService},
        {
          provide: SessionContextService,
          useValue: {selectedScope: signal(NavigationScope.ORG), selectedOrganization: () => null, selectedLocation: () => null}
        },
        {provide: AuthenticationService, useValue: authenticationService}
      ]
    })
    sessionReauthenticationService = TestBed.inject(SessionReauthenticationService)
  })

  it('replaces the session token when a secured response carries a renewed one', () => {
    const handler = {
      handle: () => of(new HttpResponse({status: 200, headers: new HttpHeaders({'X-Renewed-Token': 'renewed-token'})}))
    } as HttpHandler

    interceptSecured(handler).subscribe()

    expect(authenticationService.renewSessionToken).toHaveBeenCalledOnceWith('renewed-token')
  })

  it('leaves the session token alone when a secured response has no renewed token', () => {
    interceptSecured({handle: () => of(new HttpResponse({status: 200}))} as HttpHandler).subscribe()

    expect(authenticationService.renewSessionToken).not.toHaveBeenCalled()
  })

  it('keeps the page and asks for sign-in on a 401, without signing out', () => {
    interceptSecured(rejectingToken('token')).subscribe({error: () => {}})

    expect(sessionReauthenticationService.awaitingSignIn()).toBeTrue()
    expect(userContextService.signOut).not.toHaveBeenCalled()
  })

  it('retries the failed request with the new token once sign-in completes', () => {
    const responses: unknown[] = []
    interceptSecured(rejectingToken('token')).subscribe(response => responses.push(response))

    currentToken = 'fresh-token'
    sessionReauthenticationService.completeSignIn()

    expect(responses.length).toBe(1)
    expect(attemptedTokens).toEqual(['Bearer token', 'Bearer fresh-token'])
  })

  it('shares one sign-in between concurrent 401s and retries each of them', () => {
    const responses: unknown[] = []
    const inFlightRequests = [1, 2, 3].map(() => interceptSecured(rejectingToken('token')))
    inFlightRequests.forEach(inFlightRequest => inFlightRequest.subscribe(response => responses.push(response)))

    currentToken = 'fresh-token'
    sessionReauthenticationService.completeSignIn()

    expect(responses.length).toBe(3)
    expect(attemptedTokens.filter(token => token === 'Bearer fresh-token').length).toBe(3)
  })

  it('fails the request when sign-in is cancelled', () => {
    let failure: unknown
    interceptSecured(rejectingToken('token')).subscribe({error: error => failure = error})

    sessionReauthenticationService.cancelSignIn()

    expect(failure).toEqual(jasmine.any(HttpErrorResponse))
    expect((failure as HttpErrorResponse).status).toBe(401)
  })

  it('retries straight away when the 401 came from a token that has already been replaced', () => {
    currentToken = 'stale-token'
    const staleRequest = interceptSecured(rejectingToken('stale-token'))
    currentToken = 'fresh-token'
    const responses: unknown[] = []

    staleRequest.subscribe(response => responses.push(response))

    expect(responses.length).toBe(1)
    expect(attemptedTokens).toEqual(['Bearer stale-token', 'Bearer fresh-token'])
    expect(sessionReauthenticationService.awaitingSignIn()).toBeFalse()
  })

  it('does not ask for sign-in on errors other than 401', () => {
    interceptSecured({handle: () => throwError(() => new HttpErrorResponse({status: 500}))} as HttpHandler)
      .subscribe({error: () => {}})

    expect(sessionReauthenticationService.awaitingSignIn()).toBeFalse()
  })
})
