import {HttpClient} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {FetchService} from '../../util/base-api/fetch-service'
import {AvailableTaxTypesNode} from './available-tax-types.node'
import {AvailableTaxTypesStore} from './available-tax-types.store'

@Injectable({providedIn: 'root'})
export class AvailableTaxTypesService extends FetchService<AvailableTaxTypesNode> {

  constructor(protected override readonly store: AvailableTaxTypesStore) {
    super(store, inject(HttpClient))
  }
}
