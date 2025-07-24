import {Component, inject, OnDestroy, signal} from '@angular/core'
import {Divider} from 'primeng/divider'
import {Subscription} from 'rxjs'
import {TableModule} from 'primeng/table'
import {DatePipe} from '@angular/common'
import {Button} from 'primeng/button'
import {DbVersionService} from '../../api/db-version/db-version.service'
import {HasEditableGridComponent} from '../reusable/has-editable-grid.component'
import {EmptyRowComponent} from '../reusable/empty-row/empty-row.component'
import {AddRowComponent} from '../reusable/add-row/add-row.component'
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
export class DbVersionComponent extends HasEditableGridComponent<DbVersionService> implements OnDestroy {
  private readonly dbVersionService = inject(DbVersionService)
  readonly loading = this.dbVersionService.selectLoading
  readonly dbVersions = this.dbVersionService.selectAll

  readonly apiService = this.dbVersionService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal(false)

  readonly activatingVersions = signal<Set<string>>(new Set())

  isActivating(versionId: string) {
    return this.activatingVersions().has(versionId)
  }

  private subscription: Subscription | undefined

  activateVersion(versionId: string) {
    this.activatingVersions.update(versions => {
      versions.add(versionId)
      return new Set(versions)
    })

    this.subscription = this.dbVersionService.activateVersion(versionId)
    this.subscription.add(() => {
      this.activatingVersions.update(versions => {
        versions.delete(versionId)
        return new Set(versions)
      })
    })
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
