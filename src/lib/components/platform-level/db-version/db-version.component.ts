import {DatePipe} from '@angular/common'
import {Component, effect, inject, signal} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {DbVersionService} from '../../../api/db-version/db-version.service'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {HasEditableGridComponent} from '../../reusable/has-editable-grid.component'
import {DbVersionFormComponent} from './db-version-form/db-version-form.component'

@Component({
  selector: 'rts-db-version',
  templateUrl: 'db-version.component.html',
  imports: [
    TableModule,
    Divider,
    DatePipe,
    Button,
    EmptyRowComponent,
    AddRowComponent,
    DbVersionFormComponent
  ]
})
export class DbVersionComponent extends HasEditableGridComponent<DbVersionService> {
  private readonly dbVersionService = inject(DbVersionService)
  private readonly messageService = inject(MessageService)

  readonly loading = this.dbVersionService.selectLoading
  readonly dbVersions = this.dbVersionService.selectAll

  readonly apiService = this.dbVersionService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)
  private readonly userMadeActivationAttempt = signal(false)

  activateVersion(versionId: string) {
    this.dbVersionService.activateVersion(versionId)
    this.userMadeActivationAttempt.set(true)
  }

  constructor() {
    super()
    effect(() => {
      const madeActivationAttempt = this.userMadeActivationAttempt()
      const processingStatus = this.dbVersionService.selectProcessingStatus()
      if (madeActivationAttempt && processingStatus === ProcessingStatus.FAILURE) {
        this.postErrorMessage()
      }
    })
  }

  private postErrorMessage() {
    this.messageService.add({
      severity: 'error',
      summary: 'Activation Failed',
      detail: this.dbVersionService.selectFailureMessages().at(0)
    })
  }
}
