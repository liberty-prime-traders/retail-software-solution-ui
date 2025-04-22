import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {JobTitle} from './jobtitle.model'
import {JobTitleStore} from './jobtitle.store'


@Injectable({providedIn: 'root'})
export class JobTitleService extends BaseService<JobTitle> {
  constructor(protected override readonly store: JobTitleStore) {
    super(store)
  }
}
