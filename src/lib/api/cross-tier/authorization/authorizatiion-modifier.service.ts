import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Subscription, throwError} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {SchemaLevel} from '../../platform-level/table-registry/schema-level.enum'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {AuthorityAssignmentRequest} from './authority.model'

@Injectable({ providedIn: 'root' })
export class AuthorizationModifierService {
  private readonly httpClient = inject(HttpClient)
  private readonly baseUrl = '/secured/authorizations'

  assignAuthorities(request: AuthorityAssignmentRequest,
                    schemaLevel: SchemaLevel,
                    apiCallbacks: ApiCallbacks<void>): Subscription {
    return this.httpClient.post<void>(`${this.baseUrl}/${schemaLevel.toLowerCase()}`, request)
      .pipe(
        tap(() => apiCallbacks.onSuccess?.()),
        catchError((error) => {
          apiCallbacks.onFail?.(error)
          return throwError(() => error)
        }),
        first()
      ).subscribe()
  }

  revokeAuthorities(request: AuthorityAssignmentRequest,
                     schemaLevel: SchemaLevel,
                     apiCallbacks: ApiCallbacks<void>): Subscription {
    return this.httpClient.delete<void>(`${this.baseUrl}/${schemaLevel.toLowerCase()}`, {body: request})
      .pipe(
        tap(() => apiCallbacks.onSuccess?.()),
        catchError((error) => {
          apiCallbacks.onFail?.(error)
          return throwError(() => error)
        }),
        first()
      ).subscribe()
  }
}
