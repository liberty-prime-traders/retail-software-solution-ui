import {Component, computed, effect, inject, input, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {JobTitle} from '../../../../api/organization-level/jobtitle/jobtitle.model'
import {JobTitleService} from '../../../../api/organization-level/jobtitle/jobtitle.service'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-job-title-form',
  templateUrl: 'job-title-form.component.html',
  imports: [
    FormButtonsComponent,
    FormsModule,
    InputText,
    FormFieldComponent
  ]
})
class JobTitleFormComponent implements OnInit {
  readonly jobTitle = input<JobTitle>()

  private readonly jobTitleService = inject(JobTitleService)

  readonly processingStatus = this.jobTitleService.selectProcessingStatus
  readonly failureMessages = this.jobTitleService.selectFailureMessages


  readonly id = signal<JobTitle['id'] | undefined>(undefined)
  readonly value = signal<string>('')


  readonly touched = signal(false)
  readonly valueError = computed<string | null>(() => {
    if (!this.touched()) return null
    const MIN_LENGTH = 1

    return this.value().trim().length < MIN_LENGTH
      ? 'Job title is required'
      : null
  })

  readonly isValid = computed<boolean>(() =>
    Boolean(this.value().trim())
  )


  constructor() {
    // Sync local signal state whenever input changes (selecting a row / edit mode)
    effect(() => {
      const jt = this.jobTitle()
      this.id.set(jt?.id)
      this.value.set(jt?.value ?? '')
      this.touched.set(false)
    })
  }

  ngOnInit() {
    this.jobTitleService.resetProcessingStatus()
  }

  markTouched() {
    this.touched.set(true)
  }

  resetForm() {
    const jt = this.jobTitle()
    this.id.set(jt?.id)
    this.value.set(jt?.value ?? '')
    this.touched.set(false)
  }

  upsertJobTitle() {
    this.touched.set(true)
    if (!this.isValid()) return

    const updatedJobTitle: Partial<JobTitle> = {
      id: this.id(),
      value: this.value().trim()
    }

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

export default JobTitleFormComponent

