import {HttpClient} from '@angular/common/http'
import {inject, signal} from '@angular/core'
import {finalize, Subscription, throwError} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'

export abstract class AdminDataFixRequestService {
  private readonly httpClient = inject(HttpClient)
  private readonly requestInProgress = signal(false)
  readonly isLoading = this.requestInProgress.asReadonly()

  protected abstract readonly path: string

  run(callbacks: ApiCallbacks<void>): Subscription {
    this.requestInProgress.set(true)
    return this.httpClient.post(this.path, {}).pipe(
      tap(() => callbacks.onSuccess?.()),
      catchError((error) => {
        callbacks.onFail?.(error)
        return throwError(() => error)
      }),
      finalize(() => this.requestInProgress.set(false))
    ).subscribe()
  }
}
