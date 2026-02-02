import {computed, inject, signal} from '@angular/core'
import {FormGroup, NonNullableFormBuilder} from '@angular/forms'
import {debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap} from 'rxjs'
import {BaseModel} from '../../api/util/base-api/base.model'
import {PaginatedBaseService} from '../../api/util/paginated-api/paginated-base.service'

export abstract class BaseFilterService<ENTITY extends BaseModel, PARAMETERS> {
  protected readonly formBuilder = inject(NonNullableFormBuilder)

  protected abstract getFilterForm(): FormGroup
  protected abstract convertFormValueToSearchParameters(): PARAMETERS
  protected abstract detectAdvancedFiltersApplied(): boolean
  protected abstract passesClientSideFilters(entity: ENTITY): boolean

  readonly filterForm: FormGroup = this.getFilterForm()

  readonly requireClientSideFilter = computed(() => this.searchService.requireClientSideFilter())
  private readonly clientSideFilteredEntities = signal<ENTITY[]>([])

  protected readonly filteredEntities = computed(() => {
    if (this.searchService.requireClientSideFilter()) {
      return this.clientSideFilteredEntities()
    }
    return this.searchService.selectAll()
  })

  private readonly asyncFilterFormValue$: Observable<unknown> = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.value),
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

  private applyServerSideFilters(): null {
    if (this.filterForm.valid) {
      const parameters = this.convertFormValueToSearchParameters()
      this.searchService.refetch(parameters)
    }
    return null
  }

  reloadClientSideFilteredEntities(): null {
    const allEntities = this.searchService.selectAll()
    const filteredEntities = allEntities.filter(entity => this.passesClientSideFilters(entity))
    this.clientSideFilteredEntities.set(filteredEntities)
    return null
  }
}
