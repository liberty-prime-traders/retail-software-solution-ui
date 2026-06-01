import {
  applyEach,
  applyWhen,
  disabled,
  max,
  minLength,
  required,
  RootFieldContext,
  schema
} from '@angular/forms/signals'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {SaleSession} from '../../../../api/location-level/sale_session/sale-session.model'
import {SaleLineFormDefinition} from './sale-line-form.definition'

export namespace SaleFormDefinition {

  export interface SaleFormModel {
    contactId: string
    walkInCustomer: boolean | null
    saleLines: SaleLineFormDefinition.SaleLineFormModel[]
    payableTotal: number
    paymentTotal: number
    balance: number
    saleStatus: SaleStatus
  }


  export const fieldMap: Map<string, string> = new Map([
    ['contactId', 'Customer'],
    ['walkInCustomer', 'Walk-in Customer'],
    ['saleLines', 'Sale Lines'],
    ['payableTotal', 'Total Payable'],
    ['paymentTotal', 'Total Paid'],
    ['balance', 'Balance Due']
  ])

  export const createDefault = (): SaleFormModel => ({
    contactId: '',
    walkInCustomer: null,
    saleLines: [],
    paymentTotal: 0,
    balance: 0,
    payableTotal: 0,
    saleStatus: SaleStatus.DRAFT
  })

  export const saleFormSchema = schema<SaleFormModel>((salePath) => {
    applyEach(salePath.saleLines, (linePath) => {
      applyWhen(
        linePath,
        ({valueOf}) => valueOf(salePath.saleStatus) === SaleStatus.DRAFT,
        SaleLineFormDefinition.saleLineSchema
      )
    })

    minLength(salePath.saleLines, 1, {message: 'Sale must have at least one line'})

    required(
      salePath.contactId,
      {when: ({valueOf}) => !valueOf(salePath.walkInCustomer)}
    )

    disabled(
      salePath.contactId,
      ({valueOf}: RootFieldContext<string>) => !!valueOf(salePath.walkInCustomer)
    )

    max(
      salePath.balance,
      ({valueOf}) => valueOf(salePath.walkInCustomer) ? 0 : valueOf(salePath.payableTotal),
      {message: 'Walk-in customers must pay in full'}
    )

    max(
      salePath.paymentTotal,
      ({valueOf}) => valueOf(salePath.payableTotal),
      {message: 'Total paid cannot exceed order total'}
    )
  })

  export const convertToFormModel = (sale: SaleSession): SaleFormModel => {
    return {
      contactId: sale.contactId,
      walkInCustomer: sale.walkInCustomer ?? null,
      saleLines: SaleLineFormDefinition.mapSaleLines(sale.saleLines),
      payableTotal: sale.totals.payableTotal,
      paymentTotal: sale.totals.paymentTotal,
      balance: sale.totals.balance,
      saleStatus: sale.saleStatus
    }
  }

}
