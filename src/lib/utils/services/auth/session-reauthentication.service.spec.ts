import {HttpErrorResponse} from '@angular/common/http'
import {TestBed} from '@angular/core/testing'
import {of} from 'rxjs'
import {SessionReauthenticationService} from './session-reauthentication.service'

describe('SessionReauthenticationService', () => {
  let service: SessionReauthenticationService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SessionReauthenticationService)
  })

  it('shows the sign-in prompt while a call is waiting', () => {
    service.requestSignIn(() => of(true)).subscribe()
    expect(service.awaitingSignIn()).toBeTrue()
  })

  it('sends every waiting call once the one sign-in completes', () => {
    const responses: string[] = []
    service.requestSignIn(() => of('first')).subscribe(response => responses.push(response))
    service.requestSignIn(() => of('second')).subscribe(response => responses.push(response))

    service.completeSignIn()

    expect(responses).toEqual(['first', 'second'])
    expect(service.awaitingSignIn()).toBeFalse()
  })

  it('fails every waiting call with a 401 when the sign-in is cancelled', () => {
    const failures: HttpErrorResponse[] = []
    service.requestSignIn(() => of('sent')).subscribe({error: error => failures.push(error)})

    service.cancelSignIn()

    expect(failures.length).toBe(1)
    expect(failures[0].status).toBe(401)
    expect(service.awaitingSignIn()).toBeFalse()
  })

  it('sends a call straight away when no sign-in is pending', () => {
    const responses: string[] = []
    service.whenSignedIn(() => of('sent')).subscribe(response => responses.push(response))

    expect(responses).toEqual(['sent'])
  })

  it('holds a call until the pending sign-in completes', () => {
    const responses: string[] = []
    service.requestSignIn(() => of('retried')).subscribe(response => responses.push(response))
    service.whenSignedIn(() => of('held')).subscribe(response => responses.push(response))
    expect(responses).toEqual([])

    service.completeSignIn()

    expect(responses).toEqual(['retried', 'held'])
  })
})
