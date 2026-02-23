import {Component, inject, model, OnInit} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {Message} from 'primeng/message'
import {Select} from 'primeng/select'
import {SelectButton} from 'primeng/selectbutton'
import {SyncService} from '../../../api/location-level/sync/sync.service'
import {SyncMode, TableName} from '../../../api/location-level/sync/sync.model'
import {EnumToDropdownPipe} from '../../../utils/pipes/enum-to-dropdown.pipe'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {ActiveSyncComponent} from './active-sync.component'
import {SyncGridComponent} from './sync-grid.component'

@Component({
  selector: 'rts-sync',
  templateUrl: 'sync.component.html',
  imports: [
    Button,
    Select,
    SelectButton,
    Message,
    FormsModule,
    EnumToDropdownPipe,
    ActiveSyncComponent,
    SyncGridComponent
  ]
})
export class SyncComponent extends HasSubscriptionComponent implements OnInit {
  private readonly syncService = inject(SyncService)

  readonly SyncMode = SyncMode
  readonly TableName = TableName

  readonly selectedTable = model<TableName>(TableName.PRODUCT)
  readonly selectedMode = model<SyncMode>(SyncMode.INCREMENTAL)

  readonly loading = this.syncService.selectLoading
  readonly errorMessages = this.syncService.selectFailureMessages
  readonly syncInProgress = this.syncService.selectSyncInProgress

  ngOnInit() {
    this.syncService.fetch()
  }

  initiateSync() {
    if (this.loading() || this.syncInProgress()) return
    this.syncService.initiateSync(this.selectedTable(), this.selectedMode())
  }
}
