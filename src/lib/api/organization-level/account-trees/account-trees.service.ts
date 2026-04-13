import {HttpClient} from '@angular/common/http'
import {computed, inject, Injectable} from '@angular/core'
import {FetchService} from '../../util/base-api/fetch-service'
import {AccountsTreesForSelection} from './account-trees.model'
import {AccountTreesStore} from './account-trees.store'

@Injectable({providedIn: 'root'})
export class AccountTreesService extends FetchService<AccountsTreesForSelection> {

  readonly payable = computed(() => this.selectFirst()?.payable ?? [])
  readonly recoverable = computed(() => this.selectFirst()?.recoverable ?? [])
  readonly paymentMethods = computed(() => this.selectFirst()?.paymentMethods ?? [])

  constructor(protected override readonly store: AccountTreesStore) {
    super(store, inject(HttpClient))
  }
}
