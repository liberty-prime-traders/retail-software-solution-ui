import {HttpClient} from '@angular/common/http'
import {inject, Injectable, signal} from '@angular/core'
import {finalize, Subscription, throwError} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'

@Injectable({providedIn: 'root'})
export class SeedDataApplierService {
  private readonly httpClient = inject(HttpClient)
  private readonly applyingInProgress = signal(false)
  readonly isLoading = this.applyingInProgress.asReadonly()

  private readonly path = '/secured/organization-profile/seed-defaults'

  applySeedData(callbacks: ApiCallbacks<void>): Subscription {
    this.applyingInProgress.set(true)
    return this.httpClient.post(this.path, {}).pipe(
      tap(() => callbacks?.onSuccess?.()),
      catchError((error) => {
        callbacks?.onFail?.(error)
        return throwError(() => error)
      }),
      finalize(() => this.applyingInProgress.set(false))
    ).subscribe()
  }
}
