import {HttpParams} from '@angular/common/http'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from './api-callbacks'

export interface ApiGetRequestModel<RESPONSE, PARAMS = any> {
  id?: EntityId
  params?: PARAMS
  callbacks?: ApiCallbacks<RESPONSE>
}

export interface RtsHttpParams extends Partial<HttpParams> {
  id?: string
  pathParams?: string
  pathSuffix?: string
}

export type FetchParams = RtsHttpParams | any
