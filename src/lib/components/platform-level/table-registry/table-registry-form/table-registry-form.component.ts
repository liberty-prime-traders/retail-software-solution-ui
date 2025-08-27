import {Component, computed, inject, input, OnInit, Signal} from '@angular/core'
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {DropdownModule} from 'primeng/dropdown'
import {InputSwitchModule} from 'primeng/inputswitch'
import {InputTextModule} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {DbVersion} from '../../../../api/platform-level/db-version/db-version.model'
import {DbVersionService} from '../../../../api/platform-level/db-version/db-version.service'
import {SchemaLevel} from '../../../../api/platform-level/table-registry/schema-level.enum'
import {TableRegistry} from '../../../../api/platform-level/table-registry/table-registry.model'
import {TableRegistryService} from '../../../../api/platform-level/table-registry/table-registry.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
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
    EnumToDropdownPipe,
    FormFieldComponent,
    FormButtonsComponent,
    Select
  ],
  standalone: true
})
export class TableRegistryFormComponent implements OnInit {
  readonly registry = input<TableRegistry>()
  private readonly tableRegistryService = inject(TableRegistryService)
  private readonly dbVersionService = inject(DbVersionService)
  private readonly formBuilder = inject(NonNullableFormBuilder)

  readonly processingStatus = this.tableRegistryService.selectProcessingStatus
  readonly failureMessages = this.tableRegistryService.selectFailureMessages

  readonly schemaLevel = SchemaLevel
  readonly dbVersions: Signal<DbVersion[]> = this.dbVersionService.selectAll

  readonly form = computed(() => this.formBuilder.group({
    id: [this.registry()?.id],
    displayName: [this.registry()?.displayName, Validators.required],
    tableName: [this.registry()?.tableName, Validators.required],
    defaultPrefix: [this.registry()?.defaultPrefix ?? '', Validators.required],
    schemaLevel: [this.registry()?.schemaLevel, Validators.required],
    minimumVersionId: [this.registry()?.minimumVersionId, Validators.required],
    description: [this.registry()?.description ?? '', Validators.required],
    userFacing: [this.registry()?.userFacing]
  }))

  ngOnInit() {
    this.dbVersionService.fetch()
  }

  upsert() {
    const value = this.form().getRawValue()
    if (value.id) {
      this.tableRegistryService.put(value as any)
    } else {
      this.tableRegistryService.post(value as any)
    }
  }

  delete() {
    const id = this.registry()?.id
    this.tableRegistryService.delete(id)
  }

  reset() {
    this.form().reset()
  }
}
