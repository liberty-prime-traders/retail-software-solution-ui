import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {JobTitle} from './jobtitle.model'


@Injectable({providedIn: 'root'})
export class JobTitleStore extends createBaseStore<JobTitle>() implements BaseStore<JobTitle> {
  readonly basePath = 'jobtitle'
}
