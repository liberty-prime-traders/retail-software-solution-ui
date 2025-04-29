import {Component, signal} from '@angular/core'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {UnitGroup} from '../../../api/unit-group/unitgroup.model'
import {UnitGroupComponent} from './unit-group/unit-group.component'
import {UnitValueComponent} from './unit-value/unit-value.component'

@Component({
  selector: 'rts-unit-tree',
  templateUrl: 'unit-tree.component.html',
  imports: [
    UnitGroupComponent,
    NullSafePipe,
    UnitValueComponent
  ]
})
export class UnitTreeComponent {
  readonly selectedUnitGroup = signal<UnitGroup| undefined>(undefined)
}
