import {Component, inject, input, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {DbVersionService} from '../../../api/db-version/db-version.service'
import {DbVersion} from '../../../api/db-version/db-version.model'
import {FormButtonsComponent} from '../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'

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

  readonly dbVersionForm = this.formBuilder.nonNullable.group({
    versionNumber: ['', Validators.required],
    prevVersionId: ['']
  })

  readonly processingStatus = this.dbVersionService.selectProcessingStatus
  readonly failureMessages = this.dbVersionService.selectFailureMessages

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
