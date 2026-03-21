import {Component, signal} from '@angular/core'
import {BaseService} from '../../api/util/base-api/base.service'
import {ExpandableGridComponent} from './expandable-grid.component'

@Component({template: ''})
export abstract class GridWithAddButtonComponent<SERVICE extends BaseService<any, any>> extends ExpandableGridComponent<SERVICE> {
  readonly addingIsActive = signal(false)

  setAddingActiveTrue() {
    this.addingIsActive.set(true)
  }

  setAddingActiveFalse() {
    this.addingIsActive.set(false)
  }

  closeAddRow() {
    this.addingIsActive.set(false)
    this.rowIsExpanded.set(false)
  }
}
