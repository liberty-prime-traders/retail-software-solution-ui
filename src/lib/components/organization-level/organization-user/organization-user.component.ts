import {DatePipe, NgClass} from '@angular/common'
import {Component, effect, inject, model, signal} from '@angular/core'
import {MessageService} from 'primeng/api'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {finalize, of} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {HasGridComponent} from '../../reusable/has-grid.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {OrganizationUserService} from '../../../api/organization_user/organization-user.service'
import {OrganizationUser} from '../../../api/organization_user/organization-user.model'
import {parseError} from '../../../utils/error.util'

@Component({
  selector: 'rts-organization-user',
  templateUrl: 'organization-user.component.html',
  imports: [
    DatePipe,
    TableModule,
    NullSafePipe,
    GridFilterComponent,
    EmptyRowComponent,
    Divider,
    Button,
    Tag,
    NgClass
  ]
})
export class OrganizationUserComponent extends HasGridComponent<OrganizationUserService> {
  private readonly organizationUserService = inject(OrganizationUserService)
  private readonly messageService = inject(MessageService)

  readonly loading = this.organizationUserService.selectLoading
  readonly processingIsUnderWay = this.organizationUserService.processingIsUnderWay
  readonly organizationUsers = this.organizationUserService.selectAll

  readonly apiService = this.organizationUserService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)
  readonly isTerminatingUsers = signal(false)

  readonly ProcessingStatus = ProcessingStatus

  readonly processingStatus = this.organizationUserService.selectProcessingStatus
  readonly failureMessages = this.organizationUserService.selectFailureMessages

  readonly selectedOrganizationUsers = model<OrganizationUser[]>([])

  readonly terminationInProgress = signal(false)

  constructor() {
    super()
    effect(() => {
      if (this.processingStatus() === ProcessingStatus.SUCCESS) {
        this.selectedOrganizationUsers.set([])

        if (this.isTerminatingUsers()) {
          this.organizationUserService.refetch()
          this.isTerminatingUsers.set(false)
        }
      }
    })
  }

  terminateSelectedUsers() {
    if (!this.selectedOrganizationUsers().length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error',
        detail: 'Please select at least one user to terminate'
      })
      return
    }

    const userIds = this.selectedOrganizationUsers()
      .filter(organizationUser => !organizationUser.endOn)
      .map(organizationUser => organizationUser.id)

    this.isTerminatingUsers.set(true)

    this.organizationUserService.terminateUsers$(userIds).pipe(
      tap(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully terminated ${userIds.length} user(s)`
        })
      }),
      catchError((error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: parseError(error).join(', ') ?? 'User(s) termination failed'
        })
        return of(null)
      }),
      finalize(() => this.isTerminatingUsers.set(false))
    )
      .subscribe()
  }
}
