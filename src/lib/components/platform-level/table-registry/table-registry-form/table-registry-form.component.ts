import {Component, effect, inject, input, signal, untracked} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {ToggleSwitch} from 'primeng/toggleswitch'
import {TableRegistry} from '../../../../api/platform-level/table-registry/table-registry.model'
import {TableRegistryService} from '../../../../api/platform-level/table-registry/table-registry.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {TableRegistryFormDefinition} from './table-registry-form.definition'

@Component({
  selector: 'rts-table-registry-form',
  templateUrl: 'table-registry-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    FormField,
    InputText,
    ToggleSwitch
  ]
})
export class TableRegistryFormComponent extends BaseFormComponent<TableRegistryService> {
  readonly registry = input.required<TableRegistry>()

  private readonly tableRegistryService = inject(TableRegistryService)
  protected readonly apiService = this.tableRegistryService

  readonly tableRegistryFormModel = signal<TableRegistryFormDefinition.TableRegistryFormModel>(
    TableRegistryFormDefinition.defaultTableRegistryFormModel
  )
  readonly tableRegistryForm = form(
    this.tableRegistryFormModel,
    TableRegistryFormDefinition.tableRegistryFormSchema
  )
  readonly tableRegistryFieldMap = TableRegistryFormDefinition.fieldMap

  constructor() {
    super()
    effect(() => {
      const current = this.registry()
      untracked(() => {
        this.tableRegistryFormModel.set(
          TableRegistryFormDefinition.convertToFormModel(current)
        )
      })
    })
  }

  resetForm() {
    this.tableRegistryFormModel.set(
      TableRegistryFormDefinition.convertToFormModel(this.registry())
    )
  }

  upsertRegistry() {
    const updated = TableRegistryFormDefinition.convertToBackendModel(
      this.tableRegistryFormModel()
    )
    if (!updated.id) {
      this.tableRegistryService.post(updated)
    } else {
      this.tableRegistryService.put(updated)
    }
  }

  deleteRegistry() {
    this.tableRegistryService.delete(this.registry().id)
  }
}
