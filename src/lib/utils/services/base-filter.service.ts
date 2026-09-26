import {computed, inject, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {FormGroup, NonNullableFormBuilder} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {debounceTime, distinctUntilChanged, map, Observable, startWith, tap} from 'rxjs'
import {PaginatedBaseService} from '../../api/util/paginated-api/paginated-base.service'
import {PaginatedModel} from '../../api/util/paginated-api/paginated.model'

export abstract class BaseFilterService<ENTITY extends PaginatedModel, PARAMETERS> {
  protected readonly formBuilder = inject(NonNullableFormBuilder)

  protected abstract getFilterForm(): FormGroup
  protected abstract convertFormValueToSearchParameters(): PARAMETERS
  protected abstract detectAdvancedFiltersApplied(): boolean
  protected abstract passesClientSideFilters(entity: ENTITY): boolean

  readonly filterForm: FormGroup = this.getFilterForm()

  readonly requireClientSideFilter = computed(() => this.searchService.requireClientSideFilter())
  private readonly externalParameters = signal<Partial<PARAMETERS>>({})
  protected readonly excludeIds = signal(new Set<EntityId>())

  private readonly searchTriggeredCount = signal(0)
  readonly searchTriggered = this.searchTriggeredCount.asReadonly()

  // Tracked so `filteredEntities` reruns whenever the filter form changes, even though
  // `passesClientSideFilters()` itself reads `filterForm.value` imperatively rather than via a signal.
  private readonly filterFormValue = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    {initialValue: this.filterForm.value}
  )

  protected readonly filteredEntities = computed(() => {
    const allEntities = this.searchService.selectAll()
    let result: ENTITY[]
    if (this.searchService.requireClientSideFilter()) {
      this.filterFormValue()
      result = allEntities.filter(entity => this.passesClientSideFilters(entity))
    } else {
      result = allEntities
    }
    return result.filter(entity => !this.excludeIds().has(entity.id))
  })

  private readonly asyncFilterFormValue$: Observable<unknown> = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.value),
    debounceTime(1000),
  )

  readonly applyFilters$: Observable<unknown> = this.asyncFilterFormValue$.pipe(
    tap(() => {
      this.searchTriggeredCount.update(count => count + 1)
      if (!this.searchService.requireClientSideFilter()) {
        this.applyServerSideFilters()
      }
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

  private applyServerSideFilters(): void {
    if (this.filterForm.valid) {
      const parameters = this.convertFormValueToSearchParameters()
      this.searchService.refetch({...parameters, ...this.externalParameters()})
    }
  }
}
