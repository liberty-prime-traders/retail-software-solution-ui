import {inject, Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Organization} from './organization.model'
import {OrganizationStore} from './organization.store'
import {HttpClient} from '@angular/common/http'
import {EntityId} from '@ngrx/signals/entities'
import {Observable} from 'rxjs'
import {OrganizationLaunchResponse} from '../join-request/organization-launch-response.model'
import {catchError, first} from 'rxjs/operators'
import {OrganizationUser} from '../organization_user/organization-user.model'

@Injectable({providedIn: 'root'})
export class OrganizationService extends BaseService<Organization> {
  private readonly localHttpClient = inject(HttpClient)

  constructor(protected override readonly store: OrganizationStore) {
    super(store)
  }

  attemptLaunch$(domainId: string): Observable<OrganizationLaunchResponse> {
    return this.localHttpClient.post<OrganizationLaunchResponse>(
      `/secured/${this.store.basePath}/launch/${domainId}`,
      {}
    ).pipe(
      first(),
      catchError(error => {
        throw error
      })
    )
  }

  admitJoinRequests$(joinRequestIds: Array<EntityId>): Observable<OrganizationUser[]> {
    return this.localHttpClient.post<OrganizationUser[]>(
      `/secured/${this.store.basePath}/join-requests/admit`,
      joinRequestIds
    ).pipe(
      first(),
      catchError(error => {
        throw error
      })
    )
  }
}
