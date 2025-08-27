import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {Observable, of} from 'rxjs'
import {catchError, first} from 'rxjs/operators'
import {BaseService} from '../../../util/base-api/base.service'
import {OrganizationAdmin} from './organization-admin.model'
import {OrganizationAdminStore} from './organization-admin.store'

@Injectable({providedIn: 'root'})
export class OrganizationAdminService extends BaseService<OrganizationAdmin> {
  private readonly localHttpClient = inject(HttpClient)

  constructor(protected override readonly store: OrganizationAdminStore) {
    super(store)
  }

  isOrganizationAdmin$(): Observable<boolean> {
    return this.localHttpClient.get<boolean>(`/secured/${this.store.basePath}/is-admin`).pipe(
      first(),
      catchError(() => of(false))
    )
  }
}
