import {Injectable} from '@angular/core'
import {JobTitle} from './jobtitle.model'
import {BaseQuery} from '../base-api/base.query'
import {JobTitleState} from './jobtitle.state'
import {JobTitleStore} from './jobtitle.store'

@Injectable({providedIn: 'root'})
export class JobTitleQuery extends BaseQuery<JobTitle, JobTitleState> {
  constructor(protected override readonly store: JobTitleStore) {
    super(store)
  }
}
