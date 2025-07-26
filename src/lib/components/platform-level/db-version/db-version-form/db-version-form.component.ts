import {Component, computed, inject, input, OnInit} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {DbVersion} from '../../../../api/db-version/db-version.model'
import {DbVersionService} from '../../../../api/db-version/db-version.service'

@Component({
  selector: 'rts-db-version-form',
  templateUrl: './db-version-form.component.html',
  imports: [
    FormButtonsComponent,
    ReactiveFormsModule,
    FormFieldComponent,
    InputText,
    Select
  ]
})
export class DbVersionFormComponent implements OnInit {
  readonly versions = input<DbVersion[]>([])

  private readonly dbVersionService = inject(DbVersionService)
  private readonly formBuilder = inject(FormBuilder)

  readonly processingStatus = this.dbVersionService.selectProcessingStatus
  readonly failureMessages = this.dbVersionService.selectFailureMessages

  readonly hasPreviousVersions = computed(() => this.versions().length > 0)

  readonly dbVersionForm = this.formBuilder.nonNullable.group({
    versionNumber: ['', [Validators.required, this.versionFormatValidator()]],
    prevVersionId: ['', [this.previousVersionValidator()]]
  })

  private versionFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value
      if (!value) return null

      const pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}$/
      return pattern.test(value) ? null : {invalidFormat: true}
    }
  }

  private previousVersionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.hasPreviousVersions()) return null
      return control.value ? null : {required: true}
    }
  }

  ngOnInit() {
    this.dbVersionService.resetProcessingStatus()
  }

  createDbVersion() {
    if (this.dbVersionForm.valid) {
      this.dbVersionService.post(this.dbVersionForm.getRawValue())
    }
  }

  resetForm() {
    this.dbVersionForm.reset()
  }
}
