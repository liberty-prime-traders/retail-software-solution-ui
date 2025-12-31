import {Component, computed, inject, input} from '@angular/core'
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {DropdownModule} from 'primeng/dropdown'
import {InputSwitchModule} from 'primeng/inputswitch'
import {InputTextModule} from 'primeng/inputtext'
import {TableRegistry} from '../../../../api/platform-level/table-registry/table-registry.model'
import {TableRegistryService} from '../../../../api/platform-level/table-registry/table-registry.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-table-registry-form',
  templateUrl: 'table-registry-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputSwitchModule,
    DropdownModule,
    FormFieldComponent,
    FormButtonsComponent
  ],
  standalone: true
})
export class TableRegistryFormComponent extends BaseFormComponent<TableRegistryService>{
  readonly registry = input.required<TableRegistry>()
  private readonly tableRegistryService = inject(TableRegistryService)
  private readonly formBuilder = inject(NonNullableFormBuilder)
  protected readonly apiService = this.tableRegistryService

  readonly form = computed(() => this.formBuilder.group({
    id: [this.registry().id],
    displayName: [this.registry().displayName, Validators.required],
    defaultPrefix: [this.registry().defaultPrefix ?? '', Validators.required],
    description: [this.registry().description ?? '', Validators.required],
    userFacing: [this.registry().userFacing]
  }))

  upsert() {
    const value = this.form().getRawValue()
    if (value.id) {
      this.tableRegistryService.put(value as any)
    } else {
      this.tableRegistryService.post(value as any)
    }
  }

  delete() {
    const id = this.registry().id
    this.tableRegistryService.delete(id)
  }

  reset() {
    this.form().reset()
  }
}
