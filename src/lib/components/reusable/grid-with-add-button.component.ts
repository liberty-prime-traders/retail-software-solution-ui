import {Component, effect, signal} from '@angular/core'
import {BaseService} from '../../api/util/base-api/base.service'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {ExpandableGridComponent} from './expandable-grid.component'

@Component({template: ''})
export abstract class GridWithAddButtonComponent<SERVICE extends BaseService<any, any>> extends ExpandableGridComponent<SERVICE> {
  readonly addingIsActive = signal(false)

  constructor() {
    super()
    effect(() => {
      if (this.apiService.selectProcessingStatus() === ProcessingStatus.SUCCESS) {
        setTimeout(() => this.successfulSave(), 500)
      }
    })
  }

  setAddingActiveTrue() {
    this.addingIsActive.set(true)
  }

  setAddingActiveFalse() {
    this.addingIsActive.set(false)
  }

  successfulSave() {
    this.closeAddRow()
  }

  closeAddRow() {
    this.addingIsActive.set(false)
    this.rowIsExpanded.set(false)
  }
}
