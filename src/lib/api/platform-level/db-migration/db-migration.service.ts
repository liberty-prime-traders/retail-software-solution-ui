import {HttpParams} from '@angular/common/http'
import {inject, Injectable, signal} from '@angular/core'
import {Subscription} from 'rxjs'
import {ZonedDatesService} from '../../../utils/services/zoned-dates.service'
import {ApiRequestContext} from '../../util/base-api/api-request-config'
import {BaseService} from '../../util/base-api/base.service'
import {DbMigrationRequestDto} from './db-migration-request.dto'
import {DbMigrationRetryRequestDto} from './db-migration-retry-request.dto'
import {DbMigrationStore} from './db-migration.store'
import {OrganizationMigrationModel} from './organization-migration.model'

@Injectable({providedIn: 'root'})
export class DbMigrationService
  extends BaseService<OrganizationMigrationModel, DbMigrationRequestDto | DbMigrationRetryRequestDto> {

  private readonly zonedDatesService = inject(ZonedDatesService)

  private readonly migrationCache: Map<string, OrganizationMigrationModel[]> = new Map()
  private readonly latestQuery = signal('')

  constructor(protected override readonly store: DbMigrationStore) {
    super(store)
  }

  runMigration(request: DbMigrationRequestDto) {
    return this.postRequest({body: request, config: {upsertOnSuccess: true, urlSuffix: 'run'}})
  }

  retryFailedLocations(request: DbMigrationRetryRequestDto) {
    return this.postRequest({body: request, config: {upsertOnSuccess: true, urlSuffix: 'retry'}})
  }

  override refetch(dateRange: Date[]): Subscription|undefined {
    const [start, end] = this.getStartAndEnd(dateRange)
    const key = `${start}|${end}`
    if (this.migrationCache.has(key)) {
      this.store.setAll(this.migrationCache.get(key) ?? [])
      return undefined
    }
    this.latestQuery.set(key)
    return super.fetch(dateRange)
  }

  override getHttpParams(dateRange: Date[]): HttpParams {
    const [start, end] = this.getStartAndEnd(dateRange)
    return new HttpParams()
      .setNonNull('start', start)
      .setNonNull('end', end)
  }

  private getStartAndEnd(dateRange: Date[]): [string, string] {
    const [start, end] = dateRange
    const startString = this.zonedDatesService.pickedDateAtOrgZone(start)
    const endString = this.zonedDatesService.pickedDateAtOrgZone(end)
    return [startString, endString]
  }

  override finishSavingWithSuccess(result: OrganizationMigrationModel[], request?: ApiRequestContext) {
    this.migrationCache.set(this.latestQuery(), result)
    super.finishSavingWithSuccess(result, request)
  }
}
