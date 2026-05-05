import {Signal} from '@angular/core'
import {signalStore} from '@ngrx/signals'
import {EntityId} from '@ngrx/signals/entities'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {withBaseStore} from './base-store.feature'
import {BaseModel} from './base.model'

export interface BaseStore<ENTITY extends BaseModel> {
	entities: Signal<ENTITY[]>
	loading: Signal<boolean>
	hasCache: Signal<boolean>
	selectFirst: Signal<ENTITY | undefined>
	processingStatus: Signal<ProcessingStatus>
	failureMessages: Signal<string[]>
	basePath: string
  selectForId: (id: EntityId) => ENTITY | undefined
	setAll: (entities: ENTITY[]) => void
	upsert: (entity: ENTITY) => void
  upsertMany: (entities: ENTITY[]) => void
  setProcessingStatus: (processingStatus: ProcessingStatus) => void
	setHasCache: (hasCache: boolean) => void
	setError<T>(error: T): void
	clearError(): void
	resetStore(): void
	setLoading(loading: boolean): void
	remove(id: EntityId): void
	removeMany(ids: EntityId[]): void
}

export function createBaseStore<ENTITY extends BaseModel>(idSelector = (entity: ENTITY) => entity.id) {
  return signalStore(withBaseStore<ENTITY>(idSelector))
}
