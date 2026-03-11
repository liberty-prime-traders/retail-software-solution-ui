import {HttpErrorResponse} from '@angular/common/http'

export interface ApiCallbacks<RESPONSE> {
  onSuccess?: (result: RESPONSE) => void
  onFail?: (error: HttpErrorResponse) => void
}
