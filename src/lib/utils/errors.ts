import {isNil} from 'lodash-es'

export const parseError = (errorObj: any): string[] => {
  if (isNil(errorObj) || isNil(errorObj.error)) {
    return ['Unknown Error, Contact Admin']
  }
  const err = new Set<string>()
  if (typeof errorObj.error === 'string') {
    err.add(errorObj.error)
  }
  if (errorObj.error instanceof Array) {
    errorObj.error.forEach((errMsg: string) => err.add(errMsg))
  }

  if ('message' in errorObj.error) {
    err.add(errorObj.error['message'])
  } else   if ('message' in errorObj) {
    err.add(errorObj['message'])
  }

  return Array.from(err)
}
