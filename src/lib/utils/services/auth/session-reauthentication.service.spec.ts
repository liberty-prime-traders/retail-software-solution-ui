import {TestBed} from '@angular/core/testing'
import {SessionReauthenticationService} from './session-reauthentication.service'

describe('SessionReauthenticationService', () => {
  let service: SessionReauthenticationService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SessionReauthenticationService)
  })

  it('shows the sign-in prompt while a request is waiting', () => {
    service.requestSignIn().subscribe()
    expect(service.awaitingSignIn()).toBeTrue()
  })

  it('shares one sign-in between every waiting request and reports success to each', () => {
    const outcomes: boolean[] = []
    service.requestSignIn().subscribe(signedIn => outcomes.push(signedIn))
    service.requestSignIn().subscribe(signedIn => outcomes.push(signedIn))

    service.completeSignIn()

    expect(outcomes).toEqual([true, true])
    expect(service.awaitingSignIn()).toBeFalse()
  })

  it('reports cancellation to waiting requests and hides the prompt', () => {
    const outcomes: boolean[] = []
    service.requestSignIn().subscribe(signedIn => outcomes.push(signedIn))

    service.cancelSignIn()

    expect(outcomes).toEqual([false])
    expect(service.awaitingSignIn()).toBeFalse()
  })
})
