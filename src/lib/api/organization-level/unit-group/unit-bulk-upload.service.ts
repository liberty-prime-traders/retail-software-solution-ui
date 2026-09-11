import {inject, Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {UnitValueService} from '../unit-value/unitvalue.service'
import {UnitGroupBulkUploadRequest} from './unit-group-bulk-upload-request.dto'
import {UnitGroup} from './unitgroup.model'
import {UnitGroupStore} from './unitgroup.store'

@Injectable({providedIn: 'root'})
export class UnitBulkUploadService extends BaseService<UnitGroup, UnitGroupBulkUploadRequest> {

  private readonly unitValueService = inject(UnitValueService)

  constructor(protected override readonly store: UnitGroupStore) {
    super(store)
  }

  uploadUnits(request: UnitGroupBulkUploadRequest, callbacks?: ApiCallbacks<UnitGroup>) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'bulk'})
    return this.post(request, this.applyInternalCallBacks(
      {onSuccess: () => this.unitValueService.invalidateAll()},
      callbacks
    ))
  }
}
