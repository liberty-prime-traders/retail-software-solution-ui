import {AsyncPipe} from '@angular/common'
import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {Fruit} from '../../../../../api/fruit/fruit.model'
import {FruitService} from '../../../../../api/fruit/fruit.service'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'

@Component({
    standalone: true,
    selector: 'rts-fruit-form',
    templateUrl: 'fruit-form.component.html',
    imports: [
        ReactiveFormsModule,
        InputText,
        FormButtonsComponent,
        AsyncPipe
    ]
})
export class FruitFormComponent implements OnInit {
    
    readonly fruit = input<Fruit>()
    
    private readonly fruitService = inject(FruitService)
    private readonly formBuilder = inject(FormBuilder)
    
    readonly fruitForm = computed(() => this.formBuilder.nonNullable.group({
        id: [this.fruit()?.id],
        name: [this.fruit()?.name, Validators.required],
        alternateName: [this.fruit()?.alternativeName],
        color: [this.fruit()?.color],
        cost: [this.fruit()?.cost, Validators.required]
    }));
    
    
    readonly processingStatus$ = this.fruitService.processingStatus$()
    readonly failureMessages$ = this.fruitService.failureMessages$()
    
    ngOnInit() {
        this.fruitService.resetProcessingStatus()
    }
    
    resetForm() {
        this.fruitForm().reset(this.fruit())
    }
    
    upsertfruit() {
        const updatedfruit: Fruit = this.fruitForm().getRawValue()
        if (isNil(updatedfruit.id)) {
            this.fruitService.post(updatedfruit)
        } else {
            this.fruitService.put(updatedfruit)
        }
    }
    
    deletefruit(id?: string) {
        this.fruitService.delete(id)
    }
}
