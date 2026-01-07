import {MinValidationError, ValidationError} from '@angular/forms/signals'

export const toErrorMessages = <T> (
  fieldMap: Map<keyof T, string>,
  errors?: ValidationError.WithField[]
): string[] => {
  if (!errors || errors.length === 0) {
    return []
  }
  return errors.map((error) => {
    const prefix = fieldMap.get(toFieldName(error) as keyof T) ?? ''
    const message = error.message ?? toMessage(error)
    return prefix + ' ' + message
  })
}

export const toFieldName = (error: ValidationError.WithField): string => {
  return error.fieldTree().name().split('.').at(-1) ?? ''
}

export const toMessage = (error: ValidationError): string => {
  switch (error.kind) {
    case 'required':
      return 'is required.'
    case 'min':
      const minError = error as MinValidationError
      return `Minimum amount: ${minError.min}`
    default:
      return error.kind ?? 'Validation Error'
  }
}

