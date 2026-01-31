import {stretchVisibleElement} from '../../utils/display-manips'

export namespace AutoResizeConfig {
  export const productCategoriesId = 'product-categories'
  export const productGroupsId = 'product-groups'
  export const productLinesId = 'product-lines'
  export const unitsId = 'units'
  export const contactsId = 'contacts'
  export const dbMigrationsId = 'db-migrations'

  const autoResizeElements = [
    productCategoriesId,
    productGroupsId,
    productLinesId,
    unitsId,
    contactsId,
    dbMigrationsId
  ]

  export const stretchAllElements = (): void => {
    stretchVisibleElement(autoResizeElements)
  }
}
