import {DatePipe} from '@angular/common'
import {Component, computed, effect, inject, input, untracked} from '@angular/core'
import {TableModule} from 'primeng/table'
import {Authority} from '../../../api/cross-tier/authorization/authority.model'
import {AuthorityHolderService} from '../../../api/platform-level/authorization/authority-holder.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-authority-holder',
  templateUrl: 'authority-holder.component.html',
  imports: [
    TableModule,
    EmptyRowComponent,
    DatePipe,
    NullSafePipe
  ]
})
export class AuthorityHolderComponent {
  private readonly authorityHolderService = inject(AuthorityHolderService)

  readonly authority = input.required<Authority>()

  private readonly authorityName = computed(() => this.authority().name)

  readonly authorityHolders = this.authorityHolderService.selectForGroup(this.authorityName)
  readonly loading = this.authorityHolderService.selectLoading

  private readonly refetchAuthorityHolders = effect(() => {
    const authority = this.authority()
    untracked(() => this.authorityHolderService.getPlatformAuthorityHolders(authority.name, authority.type))
  })
}
