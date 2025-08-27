import {Component, signal} from '@angular/core'
import {UnitGroup} from '../../../api/organization-level/unit-group/unitgroup.model'
import {UnitGroupComponent} from './unit-group/unit-group.component'

@Component({
  selector: 'rts-unit-tree',
  templateUrl: 'unit-tree.component.html',
  imports: [
    UnitGroupComponent
  ]
})
export class UnitTreeComponent {
  readonly selectedUnitGroup = signal<UnitGroup| undefined>(undefined)
}
