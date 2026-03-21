import {computed} from '@angular/core'
import {patchState, signalStoreFeature, withMethods, withProps, withState} from '@ngrx/signals'
import {
  EntityId,
  removeAllEntities,
  removeEntity,
  SelectEntityId,
  setAllEntities,
  upsertEntities,
  upsertEntity,
  withEntities
} from '@ngrx/signals/entities'
import {parseError} from '../../../utils/errors'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {BaseModel} from './base.model'
import {BaseState, createInitialState} from './base.state'

export const withBaseStore = <ENTITY extends BaseModel>(selectId: SelectEntityId<ENTITY>) => signalStoreFeature(
  withState<BaseState>(createInitialState()),
  withEntities<ENTITY>(),
  withProps((store) => ({
    selectFirst: computed(() => store.entities()[0])
  })),
  withMethods((store) => ({

    selectForId(id: EntityId): ENTITY | undefined {
      return store.entityMap()[id]
    },

    setAll(entities: ENTITY[]) {
      patchState(store, setAllEntities(entities, {selectId}))
    },

    upsertMany(entities: ENTITY[]) {
      patchState(store, upsertEntities(entities, {selectId}))
    },

    upsert(entity: Partial<ENTITY>) {
      const updated = {...entity} as ENTITY
      patchState(store, upsertEntity(updated, {selectId}))
    },

    setProcessingStatus(processingStatus: ProcessingStatus) {
      patchState(store, {processingStatus})
    },

    setHasCache(hasCache: boolean) {
      patchState(store, {hasCache})
    },

    setError<T>(error: T) {
      patchState(store, {failureMessages: parseError(error)})
      this.setProcessingStatus(ProcessingStatus.FAILURE)
    },

    clearError() {
      patchState(store, {failureMessages: []})
    },

    resetStore() {
      patchState(store, createInitialState())
      patchState(store, removeAllEntities())
    },

    setLoading(loading: boolean) {
      patchState(store, {loading})
    },

    remove(id: EntityId) {
      patchState(store, removeEntity(id))
    }

  }))
)
