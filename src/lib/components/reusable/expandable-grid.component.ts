import {Component, WritableSignal} from '@angular/core'
import {BaseService} from '../../api/util/base-api/base.service'
import {BaseGridComponent} from './base-grid.component'

@Component({template: ''})
export abstract class ExpandableGridComponent<SERVICE extends BaseService<any, any>> extends BaseGridComponent<SERVICE> {
  protected abstract readonly rowIsExpanded: WritableSignal<boolean>

}
