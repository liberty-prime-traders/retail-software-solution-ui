import {Component, computed, inject, input, OnInit, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {Select} from 'primeng/select'
import {AuthorizationPass} from '../../../../api/platform-level/authorization-pass/authorization-pass.model'
import {AuthorizationPassService} from '../../../../api/platform-level/authorization-pass/authorization-pass.service'
import {PassStatus} from '../../../../api/platform-level/authorization-pass/pass-status.enum'
import {PassType} from '../../../../api/platform-level/authorization-pass/pass-type.enum'
import {SysUserService} from '../../../../api/platform-level/sys-user/sys-user.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {AuthorizationPassFormDefinition} from './authorization-pass-form.definition'

@Component({
  selector: 'rts-authorization-pass-form',
  templateUrl: 'authorization-pass-form.component.html',
  imports: [
    FormField,
    InputNumber,
    Select,
    FormFieldComponent,
    FormButtonsComponent,
    EnumToDropdownPipe,
    DatePicker
  ]
})
export class AuthorizationPassFormComponent extends BaseFormComponent<AuthorizationPassService> implements OnInit {

  private readonly authorizationPassService = inject(AuthorizationPassService)
  private readonly sysUserService = inject(SysUserService)
  protected readonly apiService = this.authorizationPassService

  readonly formValue = signal<AuthorizationPassFormDefinition.AuthorizationPassFormModel>(
    AuthorizationPassFormDefinition.defaultFormModel
  )

  readonly pass = input<AuthorizationPass>()
  readonly passForm = form(this.formValue, AuthorizationPassFormDefinition.formSchema)
  readonly passFormFields = AuthorizationPassFormDefinition.fieldMap
  readonly isCreatingNewPass = computed(() => !this.pass()?.id)
  readonly canRevoke = computed(() => this.pass()?.passStatus === PassStatus.ACTIVE)
  readonly sysUsers = this.sysUserService.selectAll

  readonly PassType = PassType
  readonly tomorrow = this.getTomorrow()

  override ngOnInit() {
    super.ngOnInit()
    this.sysUserService.fetch()
    if (this.pass()) {
      this.passForm().value.set(AuthorizationPassFormDefinition.convertToFormModel(this.pass()))
    }
  }

  resetForm() {
    this.passForm().reset(AuthorizationPassFormDefinition.convertToFormModel(this.pass()))
  }

  upsert() {
    const payload = AuthorizationPassFormDefinition.convertToBackendModel(this.formValue())
    if (payload.id) {
      this.authorizationPassService.put(payload)
    } else {
      this.authorizationPassService.issue(payload)
    }
    this.savedAtLeastOnce.set(true)
  }

  revoke() {
    const id = this.pass()?.id
    if (id) {
      this.authorizationPassService.revoke(id)
      this.savedAtLeastOnce.set(true)
    }
  }

  private getTomorrow(): Date {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }
}
