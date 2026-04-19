import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from './api-callbacks'

export interface ApiRequest<PAYLOAD, RESPONSE> {
  id?: EntityId
  body?: PAYLOAD | PAYLOAD[]
  callbacks?: ApiCallbacks<RESPONSE>
}
