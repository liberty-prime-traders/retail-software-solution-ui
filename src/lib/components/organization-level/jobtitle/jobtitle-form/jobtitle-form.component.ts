import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {DropdownModule} from 'primeng/dropdown'
import {InputText} from 'primeng/inputtext'
import {JobTitle} from '../../../../api/organization-level/jobtitle/jobtitle.model'
import {JobTitleService} from '../../../../api/organization-level/jobtitle/jobtitle.service'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'


@Component({
  selector: 'rts-jobtitle-form',
  templateUrl: 'jobtitle-form.component.html',
  imports: [
    FormButtonsComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    DropdownModule,
    FormFieldComponent
  ]
})
export class JobTitleFormComponent implements OnInit {
  readonly jobtitle = input<JobTitle>()

  private readonly jobTitleService = inject(JobTitleService)
  private readonly formBuilder = inject(FormBuilder)

  readonly jobTitleForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.jobtitle()?.id,
    value: [this.jobtitle()?.value, Validators.required]
  }))

  readonly processingStatus = this.jobTitleService.selectProcessingStatus
  readonly failureMessages = this.jobTitleService.selectFailureMessages

  ngOnInit() {
    this.jobTitleService.resetProcessingStatus()
  }

  resetForm() {
    this.jobTitleForm().reset(this.jobtitle())
  }

  upsertJobTitle() {
    const updatedJobTitle: Partial<JobTitle> = {...this.jobTitleForm().getRawValue()}
    if (isNil(updatedJobTitle.id)) {
      this.jobTitleService.post(updatedJobTitle)
    } else {
      this.jobTitleService.put(updatedJobTitle)
    }
  }

  deleteJobTitle() {
    this.jobTitleService.delete(this.jobtitle()?.id)
  }
}
