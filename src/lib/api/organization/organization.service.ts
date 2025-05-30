import {inject, Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Organization} from './organization.model'
import {OrganizationStore} from './organization.store'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import {OrganizationLaunchResponse} from '../join-request/organization-launch-response.model'
import {catchError, first} from 'rxjs/operators'

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

  admitJoinRequest$(joinRequestId: string): Observable<void> {
    return this.localHttpClient.post<void>(
      `/secured/${this.store.basePath}/admit/${joinRequestId}`,
      {}
    ).pipe(
      first(),
      catchError(error => {
        throw error
      })
    )
  }
}
