import {Component, effect, inject, input, OnInit, signal, untracked} from '@angular/core'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {JobTitle} from '../../../../api/organization-level/jobtitle/jobtitle.model'
import {JobTitleService} from '../../../../api/organization-level/jobtitle/jobtitle.service'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {FormField, form} from '@angular/forms/signals'
import {JobTitleFormDefinition} from './job-title-form.definition'

@Component({
  standalone: true,
  selector: 'rts-job-title-form',
  templateUrl: 'job-title-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField
  ]
})
export class JobTitleFormComponent implements OnInit {
  private readonly jobTitleService = inject(JobTitleService)

  readonly jobTitle = input<JobTitle>()

  readonly processingStatus = this.jobTitleService.selectProcessingStatus
  readonly failureMessages = this.jobTitleService.selectFailureMessages

  readonly jobTitleFormModel = signal<JobTitleFormDefinition.JobTitleFormModel>(
    JobTitleFormDefinition.defaultJobTitleFormModel
  )

  readonly jobTitleForm = form(
    this.jobTitleFormModel,
    JobTitleFormDefinition.jobTitleFormSchema
  )

  readonly jobTitleFieldMap = JobTitleFormDefinition.fieldMap

  constructor() {
    effect(() => {
      const localJobTitle = this.jobTitle()
      untracked(() => {
        this.jobTitleFormModel.set(
          JobTitleFormDefinition.convertToFormModel(localJobTitle)
        )
      })
    })
  }

  ngOnInit() {
    this.jobTitleService.resetProcessingStatus()
  }

  resetForm() {
    this.jobTitleFormModel.set(
      JobTitleFormDefinition.convertToFormModel(this.jobTitle())
    )
  }

  upsertJobTitle() {
    const updatedJobTitle = JobTitleFormDefinition.convertToBackendModel(this.jobTitleFormModel())

    if (isNil(updatedJobTitle.id)) {
      this.jobTitleService.post(updatedJobTitle)
    } else {
      this.jobTitleService.put(updatedJobTitle)
    }
  }

  deleteJobTitle() {
    this.jobTitleService.delete(this.jobTitle()?.id)
  }
}
