import {stretchElements} from '../../utils/display-manips'

export namespace AutoResizeConfig {
  export const productCategoriesId = 'product-categories'
  export const productGroupsId = 'product-groups'
  export const productLinesId = 'product-lines'
  export const unitsId = 'units'
  export const contactsId = 'contacts'

  const autoResizeElements = [
    productCategoriesId,
    productGroupsId,
    productLinesId,
    unitsId,
    contactsId
  ]

  export const stretchAllElements = (): void => {
    stretchElements(autoResizeElements)
  }
}
