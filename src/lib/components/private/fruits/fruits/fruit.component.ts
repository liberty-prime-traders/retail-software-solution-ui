import {AsyncPipe, DatePipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {delay, filter, Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {Fruit} from '../../../../api/fruit/fruit.model'
import {FruitService} from '../../../../api/fruit/fruit.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {KshCurrencyPipe} from '../../../../utils/pipes/currency.pipe'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {FruitFormComponent} from './fruit-form/fruit-form.component'

@Component({
    standalone: true,
    selector: 'rts-fruit',
    templateUrl: 'fruit.component.html',
    imports: [
        TableModule,
        AsyncPipe,
        NullSafePipe,
        DatePipe,
        KshCurrencyPipe,
        Button,
        FruitFormComponent,
        AddRowComponent
    ]
})
export class FruitComponent extends HasSubscriptionComponent implements OnInit {
    private readonly fruitService = inject(FruitService)
    readonly loading$ = this.fruitService.selectLoading$()
    readonly processingIsUnderWay$ = this.fruitService.processingIsUnderWay$()
    readonly fruits$ = this.fruitService.selectAll$()
    selectedFruit = model<Fruit|undefined>(undefined)

    readonly addingIsActive = signal(false)
    readonly rowIsExpanded = signal<boolean>(false)

    ngOnInit() {
        this.fruitService.fetch()
        this.subscriptions.add(this.listenToFruitSaveStatus())
    }

    private listenToFruitSaveStatus(): Subscription {
        return this.fruitService.processingStatus$().pipe(
            filter(status => status === ProcessingStatus.SUCCESS),
            delay(500),
            tap(() => this.addingIsActive.set(false))
        )
            .subscribe()
    }
}
