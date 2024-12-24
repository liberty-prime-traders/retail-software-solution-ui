import {HttpContext, HttpHeaders, HttpParams} from '@angular/common/http'

export interface RtsHttpOptions {
	id?: string
	headers?: HttpHeaders | {
		[header: string]: string | string[]
	}
	context?: HttpContext
	observe?: 'body'
	params?: HttpParams | {
		[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>
	}
	reportProgress?: boolean
	responseType?: 'json'
	withCredentials?: boolean
	transferCache?: {
		includeHeaders?: string[]
	} | boolean
	pathParams?: string
}
