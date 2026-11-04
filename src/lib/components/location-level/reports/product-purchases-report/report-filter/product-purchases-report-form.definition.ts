import {schema} from '@angular/forms/signals'
import {ProductPurchasesDeliveryLinesParameters} from '../../../../../api/location-level/product-purchases-report/product-purchases-delivery-lines-parameters.model'
import {ProductPurchasesReportParameters} from '../../../../../api/location-level/product-purchases-report/product-purchases-report-parameters.model'
import {getToday, getTomorrow} from '../../../../../utils/dates'
import {ZonedDatesService} from '../../../../../utils/services/zoned-dates.service'

export namespace ProductPurchasesReportFormDefinition {
  export interface ProductPurchasesReportFormModel {
    deliveredFrom: Date | null
    deliveredBefore: Date | null
    locationProductIds: string[]
    categoryIds: string[]
    supplierIds: string[]
  }

  export const createDefaultFormModel = (): ProductPurchasesReportFormModel => {
    const sevenDaysAgo = getToday()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    return {
      deliveredFrom: sevenDaysAgo,
      deliveredBefore: getTomorrow(),
      locationProductIds: [],
      categoryIds: [],
      supplierIds: []
    }
  }

  export const productPurchasesReportFormSchema = schema<ProductPurchasesReportFormModel>(() => {})

  // Both bounds are required by the API, so an empty range yields no request.
  export const convertToReportParameters = (
    formValue: ProductPurchasesReportFormModel,
    zonedDatesService: ZonedDatesService
  ): ProductPurchasesReportParameters | null => {
    const deliveredFrom = zonedDatesService.atOrgZone(formValue.deliveredFrom)
    const deliveredBefore = zonedDatesService.atOrgZone(formValue.deliveredBefore)
    if (!deliveredFrom || !deliveredBefore) {
      return null
    }
    return {
      deliveredFrom,
      deliveredBefore,
      locationProductIds: formValue.locationProductIds,
      categoryIds: formValue.categoryIds,
      supplierIds: formValue.supplierIds
    }
  }

  export const convertToDeliveryLinesParameters = (
    formValue: ProductPurchasesReportFormModel,
    zonedDatesService: ZonedDatesService
  ): ProductPurchasesDeliveryLinesParameters | null => {
    const deliveredFrom = zonedDatesService.atOrgZone(formValue.deliveredFrom)
    const deliveredBefore = zonedDatesService.atOrgZone(formValue.deliveredBefore)
    if (!deliveredFrom || !deliveredBefore) {
      return null
    }
    return {deliveredFrom, deliveredBefore, supplierIds: formValue.supplierIds}
  }
}
