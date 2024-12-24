import {HttpErrorResponse} from '@angular/common/http'
import {EntityStore, QueryEntity} from '@datorama/akita'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {BaseModel} from './base.model'
import {BaseState} from './base.state'

export abstract class BaseQuery<E extends BaseModel, STATE extends BaseState<E>> extends QueryEntity<STATE, E, string> {
    protected constructor(protected override readonly store: EntityStore<STATE>) {
        super(store)
    }

    selectSaveProcessingStatus(): Observable<ProcessingStatus> {
        return this.select((state) => state.saveStatus)
    }

    selectDeleteProcessingStatus(): Observable<ProcessingStatus> {
        return this.select((state) => state.deleteStatus)
    }

    selectFetchProcessingStatus(): Observable<ProcessingStatus|undefined> {
        return this.select((state) => state.fetchStatus)
    }

    selectFailureMessages(): Observable<string[]> {
        return this.select((state) => state.failureMessages)
    }

    selectErrorMessage(): Observable<string> {
        return this.selectError().pipe(
            map((err) => this.parseError(err))
        )
    }

    parseError(error: HttpErrorResponse): string {
        if (error === null) {
            return ''
        }
        let err = ''
        if (error.status === 400) {
            if (typeof error.error === 'string') {
                err = error.error
            } else if (error.error instanceof Array) {
                err = error.error.filter((item) => typeof item === 'string').pop()
            } else if ('message' in error.error) {
                err = error.error['message']
            }
        }
        return err
    }
}
