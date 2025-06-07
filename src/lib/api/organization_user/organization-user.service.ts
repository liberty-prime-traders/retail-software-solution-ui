import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import {EntityId} from '@ngrx/signals/entities'
import {finalize, Observable} from 'rxjs'
import {catchError, first, tap} from 'rxjs/operators'
import {inject, Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {OrganizationUser} from './organization-user.model'
import {OrganizationUserStore} from './organization-user.store'

@Injectable({providedIn: 'root'})
export class OrganizationUserService extends BaseService<OrganizationUser> {
  private readonly localHttpClient = inject(HttpClient)

  constructor(protected override readonly store: OrganizationUserStore) {
    super(store)
  }

  terminateUsers$(organizationUserIds: Array<EntityId>): Observable<OrganizationUser[]> {
    return this.localHttpClient.post<OrganizationUser[]>(
      `/secured/${this.store.basePath}/terminate`,
      organizationUserIds
    ).pipe(
      first(),
      tap((response) => this.finishSavingWithSuccess(response)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.store.setLoading(false))
    )
  }
}
