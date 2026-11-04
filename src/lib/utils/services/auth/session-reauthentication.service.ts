import {HttpErrorResponse} from '@angular/common/http'
import {Injectable, signal} from '@angular/core'
import {Observable, Subject, throwError} from 'rxjs'
import {switchMap, take} from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class SessionReauthenticationService {
  private readonly _awaitingSignIn = signal(false)
  readonly awaitingSignIn = this._awaitingSignIn.asReadonly()

  private readonly outcomes = new Subject<boolean>()

  // Every call that fails while the session is gone waits on the same outcome, so one sign-in serves them all.
  requestSignIn<T>(
    send: () => Observable<T>,
    unauthorizedError: HttpErrorResponse = new HttpErrorResponse({status: 401})
  ): Observable<T> {
    this._awaitingSignIn.set(true)
    return this.afterOutcome(send, unauthorizedError)
  }

  // Calls made while a sign-in is pending wait for its outcome, so they never fire with the stale token.
  whenSignedIn<T>(
    send: () => Observable<T>,
    unauthorizedError: HttpErrorResponse = new HttpErrorResponse({status: 401})
  ): Observable<T> {
    return this._awaitingSignIn() ? this.afterOutcome(send, unauthorizedError) : send()
  }

  completeSignIn(): void {
    this.finish(true)
  }

  cancelSignIn(): void {
    this.finish(false)
  }

  private afterOutcome<T>(send: () => Observable<T>, unauthorizedError: HttpErrorResponse): Observable<T> {
    return this.outcomes.pipe(
      take(1),
      switchMap(signedIn => signedIn ? send() : throwError(() => unauthorizedError))
    )
  }

  private finish(signedIn: boolean): void {
    this._awaitingSignIn.set(false)
    this.outcomes.next(signedIn)
  }
}
