import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable, throwError} from 'rxjs'
import {catchError, first} from 'rxjs/operators'
import {BaseService} from '../../util/base-api/base.service'
import {OrganizationLaunchResponse} from './organization-launch-response.model'
import {Organization} from './organization.model'
import {OrganizationStore} from './organization.store'

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
      catchError(error => throwError(() => error))
    )
  }
}
