import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from './api-callbacks'
import {ApiRequestConfig} from './api-request-config'

export interface ApiRequest<PAYLOAD, RESPONSE> {
  id?: EntityId
  body?: PAYLOAD | PAYLOAD[]
  callbacks?: ApiCallbacks<RESPONSE>
  config?: Partial<ApiRequestConfig>
}
