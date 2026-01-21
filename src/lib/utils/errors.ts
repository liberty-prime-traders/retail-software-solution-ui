import {isNil} from 'lodash-es'

export const parseError = (errorObj: any): string[] => {
  if (isNil(errorObj) || isNil(errorObj.error)) {
    return ['Unknown Error, Contact Admin']
  }
  let err = []
  if (typeof errorObj.error === 'string') {
    err = [errorObj.error]
  } else if (errorObj.error instanceof Array) {
    err = errorObj.error
  } else if ('message' in errorObj.error) {
    err = [errorObj.error['message']]
  }

  return err
}
