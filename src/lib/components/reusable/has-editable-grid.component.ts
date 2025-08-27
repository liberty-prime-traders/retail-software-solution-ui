import {Component, effect, OnInit, WritableSignal} from '@angular/core'
import {BaseService} from '../../api/util/base-api/base.service'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'

@Component({template: ''})
export abstract class HasEditableGridComponent<SERVICE extends BaseService<any, any>> implements OnInit {
  abstract readonly apiService: SERVICE
  abstract readonly addingIsActive: WritableSignal<boolean>
  abstract readonly rowIsExpanded: WritableSignal<boolean>

  constructor() {
    effect(() => {
      const processingStatus = this.apiService.selectProcessingStatus()
      if (processingStatus === ProcessingStatus.SUCCESS) {
        setTimeout(() => this.closeAddRow(), 500)
      }
    })
  }

  ngOnInit() {
    this.apiService.fetch()
  }

  closeAddRow() {
    this.addingIsActive.set(false)
    this.rowIsExpanded.set(false)
  }
}
