import {EntityId} from '@ngrx/signals/entities'

export interface ApiRequestConfig {
  upsertOnSuccess?: boolean
  urlSuffix: string
  urlPrefix: string
}

export interface ApiRequestContext {
  id?: EntityId
  config?: Partial<ApiRequestConfig>
}
