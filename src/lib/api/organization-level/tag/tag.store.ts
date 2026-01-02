import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Tag} from './tag.model'

@Injectable({providedIn: 'root'})
export class TagStore extends createBaseStore<Tag>() implements BaseStore<Tag> {
  readonly basePath = 'tag'
}
