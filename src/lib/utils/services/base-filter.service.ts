import {computed, inject, signal} from '@angular/core'
import {FormGroup, NonNullableFormBuilder} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap} from 'rxjs'
import {tap} from 'rxjs/operators'
import {PaginatedBaseService} from '../../api/util/paginated-api/paginated-base.service'
import {PaginatedModel} from '../../api/util/paginated-api/paginated.model'

export abstract class BaseFilterService<ENTITY extends PaginatedModel, PARAMETERS> {
  protected readonly formBuilder = inject(NonNullableFormBuilder)

  protected abstract getFilterForm(): FormGroup
  protected abstract convertFormValueToSearchParameters(): PARAMETERS
  protected abstract detectAdvancedFiltersApplied(): boolean
  protected abstract passesClientSideFilters(entity: ENTITY, deferredParameters?: Partial<PARAMETERS>): boolean

  readonly filterForm: FormGroup = this.getFilterForm()

  readonly requireClientSideFilter = computed(() => this.searchService.requireClientSideFilter())
  private readonly clientSideFilteredEntities = signal<ENTITY[]>([])
  private readonly externalParameters = signal<Partial<PARAMETERS>>({})

  protected readonly filteredEntities = computed(() => {
    if (this.searchService.requireClientSideFilter()) {
      return this.clientSideFilteredEntities()
    }
    return this.searchService.selectAll()
  })

  private readonly asyncFilterFormValue$: Observable<unknown> = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.value),
    tap(() => console.log('Filter form value changed:', this.filterForm.value)),
    debounceTime(1000),
  )

  readonly applyFilters$: Observable<null> = this.asyncFilterFormValue$.pipe(
    switchMap(() => {
      if (this.searchService.requireClientSideFilter()) {
        return of(this.reloadClientSideFilteredEntities())
      }
      return of(this.applyServerSideFilters())
    })
  )

  readonly advancedFilterInUse$: Observable<boolean> = this.asyncFilterFormValue$.pipe(
    map(() => this.detectAdvancedFiltersApplied()),
    distinctUntilChanged()
  )

  protected constructor(protected readonly searchService: PaginatedBaseService<ENTITY, PARAMETERS>) {}

  resetFilters(): void {
    this.filterForm.reset()
  }

  resetExternalParameters(parameters: Partial<PARAMETERS>): void {
    this.externalParameters.set(parameters)
    this.afterExternalParametersReset(parameters)
  }

  afterExternalParametersReset(parameters: Partial<PARAMETERS>) {}

  removeEntities(ids: EntityId[]) {
    if (this.searchService.requireClientSideFilter()) {
      const remainingEntities = this.clientSideFilteredEntities().filter(entity => !ids.includes(entity.id))
      this.clientSideFilteredEntities.set(remainingEntities)
    } else {
      this.searchService.removeEntities(ids)
    }
  }

  private applyServerSideFilters(): null {
    if (this.filterForm.valid) {
      const parameters = this.convertFormValueToSearchParameters()
      this.searchService.refetch({...parameters, ...this.externalParameters()})
    }
    return null
  }

  reloadClientSideFilteredEntities(): null {
    const allEntities = this.searchService.selectAll()
    const filteredEntities = allEntities.filter(entity =>
      this.passesClientSideFilters(entity, this.externalParameters())
    )
    this.clientSideFilteredEntities.set(filteredEntities)
    return null
  }
}
