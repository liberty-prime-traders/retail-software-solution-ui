import {Component} from '@angular/core'
import {FruitComponent} from './fruits/fruit.component'

@Component({
    standalone: true,
    selector: 'rts-fruits',
    templateUrl: 'fruits.component.html',
    imports: [
        FruitComponent
    ]
})
export class FruitsComponent {

}
