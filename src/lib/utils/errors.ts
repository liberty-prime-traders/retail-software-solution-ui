export const parseError = (error: any): string[] => {
  if (error === null) {
    return ['Unknown Error, Contact Admin']
  }
  let err = []
  if (typeof error.error === 'string') {
    err = [error.error]
  } else if (error.error instanceof Array) {
    err = error.error
  } else if ('message' in error.error) {
    err = [error.error['message']]
  }

  return err
}
