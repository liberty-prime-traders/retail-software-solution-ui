import {HttpParams} from '@angular/common/http'

export interface RtsHttpParams extends Partial<HttpParams> {
	id?: string
	pathParams?: string
}
