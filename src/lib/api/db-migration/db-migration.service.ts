import {HttpParams} from '@angular/common/http'
import {Injectable, signal} from '@angular/core'
import {Subscription} from 'rxjs'
import {BaseService} from '../base-api/base.service'
import {DbMigrationStore} from './db-migration.store'
import {DbMigrationRequestDto} from './db-migration-request.dto'
import {DbMigrationRetryRequestDto} from './db-migration-retry-request.dto'
import {OrganizationMigrationModel} from './organization-migration.model'

@Injectable({providedIn: 'root'})
export class DbMigrationService extends BaseService<OrganizationMigrationModel, DbMigrationRequestDto | DbMigrationRetryRequestDto> {
  private readonly migrationCache: Map<string, OrganizationMigrationModel[]> = new Map()
  private readonly latestQuery = signal('')

  constructor(protected override readonly store: DbMigrationStore) {
    super(store)
  }

  runMigration(request: DbMigrationRequestDto) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'run'})
    return this.post(request)
  }

  retryFailedLocations(request: DbMigrationRetryRequestDto) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'retry'})
    return this.post(request)
  }

  override refetch(dateRange: Date[]): Subscription|undefined {
    const [start, end] = this.getStartAndEnd(dateRange)
    const key = `${start}|${end}`
    if (this.migrationCache.has(key)) {
      this.store.setAll(this.migrationCache.get(key) ?? [])
      return
    } else {
      this.latestQuery.set(key)
      return super.fetch(dateRange)
    }
  }

  override getHttpParams(dateRange: Date[]): HttpParams {
    const [start, end] = this.getStartAndEnd(dateRange)
    return new HttpParams().setNonNull('start', start).setNonNull('end', end)
  }

  private getStartAndEnd(dateRange: Date[]): [string, string] {
    const [start, end] = dateRange
    const startString = start.toISOString()
    const endString = end.toISOString()
    return [startString, endString]
  }

  override finishSavingWithSuccess(result: OrganizationMigrationModel[]) {
    this.migrationCache.set(this.latestQuery(), result)
    super.finishSavingWithSuccess(result)
  }
}
