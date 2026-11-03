import {HttpErrorResponse} from '@angular/common/http'
import {computed, Signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {throwError} from 'rxjs'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {RtsDeclaredTypes} from '../../../utils/types/rts-declared-types'
import {isPaginated} from '../paginated-api/page-response.model'
import {ApiRequestConfig, ApiRequestContext} from './api-request-config'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'

export abstract class ServiceFacade<RESPONSE extends BaseModel> {
  readonly selectLoading
  readonly selectFirst
  readonly selectAll: Signal<RESPONSE[]>
  readonly selectProcessingStatus
  readonly selectFailureMessages
  readonly selectCount: Signal<number>

  private readonly defaultApiRequestConfig: ApiRequestConfig = {
    upsertOnSuccess: false,
    urlSuffix: '',
    urlPrefix: 'secured/'
  }

  protected constructor(protected readonly store: BaseStore<RESPONSE>) {
    this.selectLoading = this.store.loading
    this.selectFirst = this.store.selectFirst
    this.selectAll = this.store.entities
    this.selectProcessingStatus = this.store.processingStatus
    this.selectFailureMessages = this.store.failureMessages
    this.selectCount = computed(() => this.selectAll().length)
  }

  selectForId(id: EntityId): RESPONSE | undefined {
    return this.store.selectForId(id)
  }

  protected prepareResponse(body: RtsDeclaredTypes.OrPaginated<RESPONSE>, idParam?: EntityId): any {
    if (idParam) {
      return {...body, id: idParam}
    }
    if (isPaginated(body)) {
      return body.contents
    }
    return body
  }

  protected resolveApiRequestConfig(config?: Partial<ApiRequestConfig>): ApiRequestConfig {
    return {...this.defaultApiRequestConfig, ...config}
  }

  protected isSecuredRequest(config?: Partial<ApiRequestConfig>): boolean {
    return this.resolveApiRequestConfig(config).urlPrefix.startsWith('secured')
  }

  protected getBasePath(id?: EntityId, config?: Partial<ApiRequestConfig>): string {
    const {urlSuffix, urlPrefix} = this.resolveApiRequestConfig(config)
    const idPath = id ? `/${id}` : ''
    const suffixPath = urlSuffix ? `/${urlSuffix}` : ''
    return `/${urlPrefix}${this.store.basePath}${idPath}${suffixPath}`
  }

  protected setProcessingStatus(processingStatus: ProcessingStatus): void {
    this.store.setProcessingStatus(processingStatus)
  }

  protected startApiRequest() {
    this.store.setLoading(true)
    this.setProcessingStatus(ProcessingStatus.IN_PROGRESS)
    this.store.clearError()
  }

  protected finalizeApiRequest() {
    this.store.setLoading(false)
  }

  resetProcessingStatus() {
    this.setProcessingStatus(ProcessingStatus.IDLE)
    this.store.clearError()
  }

  applyResponse(entity: RESPONSE) {
    this.store.upsert(entity)
  }

  protected finishSavingWithSuccess(response: RtsDeclaredTypes.OrPaginated<RESPONSE>, request?: ApiRequestContext) {
    const result = this.prepareResponse(response, request?.id)
    if (Array.isArray(result)) {
      if (this.resolveApiRequestConfig(request?.config).upsertOnSuccess) {
        this.store.upsertMany(result)
      } else {
        this.store.setAll(result)
      }
    } else if (!isNil(result)) {
      this.store.upsert(result)
    }
    this.store.setHasCache(true)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  protected finishDeletingWithSuccess(id: EntityId) {
    this.store.remove(id)
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  protected setStoreError(error: HttpErrorResponse) {
    this.store.setError(error)
    this.store.setHasCache(false)
    return throwError(() => error)
  }

  removeEntities(ids: EntityId[]) {
    this.store.removeMany(ids)
  }
}
