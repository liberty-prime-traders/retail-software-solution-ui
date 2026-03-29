import {computed, Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {CalculationMethod} from './calculation-method.enum'
import {TaxType} from './tax-type.model'
import {TaxTypeStore} from './tax-type.store'

@Injectable({providedIn: 'root'})
export class TaxTypeService extends BaseService<TaxType> {

  readonly taxTypesMap = computed<Map<string, TaxType>>(() =>
    new Map(this.selectAll().map(t => [t.id as string, t]))
  )

  constructor(protected override readonly store: TaxTypeStore) {
    super(store)
  }

  readonly getCalculationMethodForTaxType = (taxTypeId?: string): CalculationMethod => {
    if (!taxTypeId) {
      return CalculationMethod.PERCENTAGE
    }
    return this.taxTypesMap().get(taxTypeId)?.calculationMethod || CalculationMethod.PERCENTAGE
  }
}
