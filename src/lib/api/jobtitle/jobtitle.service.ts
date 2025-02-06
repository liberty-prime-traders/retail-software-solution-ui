import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {JobTitleQuery} from './jobtitle.query'
import {JobTitleStore} from './jobtitle.store'
import {JobTitle} from './jobtitle.model'
import {JobTitleState} from './jobtitle.state'


@Injectable({providedIn: 'root'})
export class JobTitleService extends BaseService<JobTitle, JobTitleState> {
  constructor(protected override readonly store: JobTitleStore,
              protected override readonly query: JobTitleQuery) {
    super(store, query)
  }
}
