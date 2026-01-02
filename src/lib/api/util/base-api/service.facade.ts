import {HttpErrorResponse} from '@angular/common/http'
import {computed, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {throwError} from 'rxjs'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {ApiRequestConfig} from './api-request-config'
import {BaseModel} from './base.model'
import {BaseStore} from './base.store'

export abstract class ServiceFacade<RESPONSE extends BaseModel> {
  readonly selectLoading
  readonly selectFirst
  readonly selectAll
  readonly selectProcessingStatus
  readonly selectFailureMessages
  readonly processingIsUnderWay
  readonly lastSavedResponse = signal<RESPONSE|undefined>(undefined)
  private readonly defaultApiRequestConfig: ApiRequestConfig = {
    upsertOnSuccess: false,
    urlSuffix: ''
  }
  private readonly apiRequestConfig = signal<ApiRequestConfig>(this.defaultApiRequestConfig)

  protected constructor(protected readonly store: BaseStore<RESPONSE>) {
    this.selectLoading = this.store.loading
    this.selectFirst = this.store.selectFirst
    this.selectAll = this.store.entities
    this.selectProcessingStatus = this.store.processingStatus
    this.selectFailureMessages = this.store.failureMessages
    this.processingIsUnderWay = computed(() => this.selectProcessingStatus() === ProcessingStatus.IN_PROGRESS)
  }

  protected prepareResponse(body: RESPONSE | RESPONSE[], idParam?: EntityId): any {
    return idParam ? [{...body, id: idParam}] : body
  }

  protected getBasePath(id?: EntityId): string {
    const idPath = id ? `/${id}` : ''
    const urlSuffix = this.apiRequestConfig().urlSuffix
    const suffixPath = urlSuffix ? `/${urlSuffix}` : ''
    return `/secured/${this.store.basePath}${idPath}${suffixPath}`
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
    this.apiRequestConfig.set(this.defaultApiRequestConfig)
  }

  protected patchApiRequestConfig(config: Partial<ApiRequestConfig>) {
    this.apiRequestConfig.update((currentConfig) => ({...currentConfig, ...config}))
  }

  resetProcessingStatus() {
    this.setProcessingStatus(ProcessingStatus.IDLE)
  }

  protected finishSavingWithSuccess(response: RESPONSE | RESPONSE[], idParam?: EntityId) {
    const result = this.prepareResponse(response, idParam)
    if (Array.isArray(result)) {
      if (this.apiRequestConfig().upsertOnSuccess) {
        this.store.upsertMany(result)
      } else {
        this.store.setAll(result)
      }
    } else if (!isNil(result)) {
      this.store.upsert(result)
      this.lastSavedResponse.set(result)
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
}
