import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {Tag} from './tag.model'
import {TagStore} from './tag.store'

@Injectable({providedIn: 'root'})
export class TagService extends BaseService<Tag> {
  constructor(protected override readonly store: TagStore) {
    super(store)
  }
}
