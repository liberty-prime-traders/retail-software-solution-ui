import {Component, computed, inject, input, OnInit} from '@angular/core'
import {AsyncPipe} from '@angular/common'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {InputText} from 'primeng/inputtext'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {DropdownModule} from 'primeng/dropdown'
import {JobTitle} from '../../../../api/jobtitle/jobtitle.model'
import {JobTitleService} from '../../../../api/jobtitle/jobtitle.service'
import {isNil} from 'lodash-es'


@Component({
  standalone: true,
  selector: 'rts-jobtitle-form',
  templateUrl: 'jobtitle-form.component.html',
  imports: [
    AsyncPipe,
    FormButtonsComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    DropdownModule,
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

  readonly processingStatus$ = this.jobTitleService.processingStatus$()
  readonly failureMessages$ = this.jobTitleService.failureMessages$()

  ngOnInit() {
    this.jobTitleService.resetProcessingStatus()
  }

  resetForm() {
    this.jobTitleForm().reset(this.jobtitle())
  }

  upsertJobTitle() {
    const updatedJobTitle: JobTitle = {...this.jobTitleForm().getRawValue()}
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
