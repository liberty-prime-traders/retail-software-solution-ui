import {Injectable, signal} from '@angular/core'
import {Observable, Subject} from 'rxjs'
import {take} from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class SessionReauthenticationService {
  private readonly _awaitingSignIn = signal(false)
  readonly awaitingSignIn = this._awaitingSignIn.asReadonly()

  private readonly outcomes = new Subject<boolean>()

  // Every request that fails while the session is gone waits
  // on the same outcome, so one sign-in serves them all.
  requestSignIn(): Observable<boolean> {
    this._awaitingSignIn.set(true)
    return this.outcomes.pipe(take(1))
  }

  completeSignIn(): void {
    this.finish(true)
  }

  cancelSignIn(): void {
    this.finish(false)
  }

  private finish(signedIn: boolean): void {
    this._awaitingSignIn.set(false)
    this.outcomes.next(signedIn)
  }
}
