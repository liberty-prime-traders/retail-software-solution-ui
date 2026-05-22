import {Signal} from '@angular/core'
import {applyEach, disabled, max, required, RootFieldContext, schema} from '@angular/forms/signals'
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
    payableTotal: 0
  })

  export const createSaleFormSchema = (productIdsForTouchedLines: Signal<Set<string>>) =>
    schema<SaleFormModel>((path) => {
      applyEach(path.saleLines, SaleLineFormDefinition.createSaleLineSchema(productIdsForTouchedLines))

      required(
        path.contactId,
        {when: ({valueOf}) => !valueOf(path.walkInCustomer)}
      )

      disabled(
        path.contactId,
        ({valueOf}: RootFieldContext<string>) => !!valueOf(path.walkInCustomer)
      )

      max(
        path.balance,
        ({valueOf}) => valueOf(path.walkInCustomer) ? 0 : valueOf(path.payableTotal),
        {message: 'Walk-in customers must pay in full'}
      )

      max(
        path.paymentTotal,
        ({valueOf}) => valueOf(path.payableTotal),
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
      balance: sale.totals.balance
    }
  }

}
