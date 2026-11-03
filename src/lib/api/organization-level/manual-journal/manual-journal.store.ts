import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ManualJournal} from './manual-journal.model'

@Injectable({providedIn: 'root'})
export class ManualJournalStore extends createBaseStore<ManualJournal>() implements BaseStore<ManualJournal> {
  readonly basePath = 'manual-journals'
}
