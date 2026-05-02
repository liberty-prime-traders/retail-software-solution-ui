import {Component, computed, inject, OnInit, output} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {EntityId} from '@ngrx/signals/entities'
import {Select} from 'primeng/select'
import {BehaviorSubject, debounceTime, distinctUntilChanged, filter} from 'rxjs'
import {tap} from 'rxjs/operators'
import {
  LocationProductQuickSearchService
} from '../../../api/location-level/location-product/location-product-quick-search.service'
import {LocationProduct} from '../../../api/location-level/location-product/location-product.model'
import {LocationProductStore} from '../../../api/location-level/location-product/location-product.store'
import {UnitConversionGraphService} from '../../../api/organization-level/unit-conversion/unit-conversion-graph.service'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'

@Component({
  selector: 'rts-product-lookup',
  templateUrl: 'location-product-lookup.component.html',
  providers: [
    LocationProductQuickSearchService,
    LocationProductStore
  ],
  imports: [
    FormFieldComponent,
    Select
  ]
})
export class LocationProductLookupComponent extends HasSubscriptionComponent implements OnInit {
  readonly productSelected = output<LocationProduct>()

  private readonly productQuickSearchService = inject(LocationProductQuickSearchService)
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  readonly searchTerm$ = new BehaviorSubject('')
  readonly productOptions = this.productQuickSearchService.productOptions
  readonly productsMap = this.productQuickSearchService.productsMap

  readonly dependenciesLoading = computed(() =>
    this.productQuickSearchService.selectLoading() || this.unitConversionGraphService.isLoading()
  )

  private readonly refetchProducts$ = this.searchTerm$.pipe(
    filter(Boolean),
    debounceTime(500),
    distinctUntilChanged(),
    tap((searchTerm) => {
      this.productQuickSearchService.fetchProducts(searchTerm)
    }),
    takeUntilDestroyed(this.destroyRef)
  )

  ngOnInit() {
    this.productQuickSearchService.fetchProducts('')
    this.refetchProducts$.subscribe()
  }

  emitSelectedProduct(locationProductId: EntityId) {
    const selectedProduct = this.productsMap().get(locationProductId)
    if (selectedProduct) {
      this.productSelected.emit(selectedProduct)
    }
  }

}
