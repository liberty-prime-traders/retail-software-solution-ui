import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {BaseStore} from '../base-api/base.store'
import {JobTitle} from './jobtitle.model'
import {JobTitleState} from './jobtitle.state'
import {createInitialState} from '../base-api/base.state'


@Injectable({providedIn: 'root'})
@StoreConfig({name: 'jobtitle'})
export class JobTitleStore extends BaseStore<JobTitle, JobTitleState> {
  constructor() {
    super(createInitialState())
  }
}
