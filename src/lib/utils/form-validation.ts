import {
  MaxLengthValidationError,
  MaxValidationError,
  MinLengthValidationError,
  MinValidationError,
  ValidationError
} from '@angular/forms/signals'

export const toErrorMessages = <T> (
  fieldMap: Map<keyof T, string>,
  errors?: ValidationError.WithFieldTree[]
): string[] => {
  if (!errors || errors.length === 0) {
    return []
  }
  return errors.map((error) => {
    if (error.message) {
      return error.message
    }
    const prefix = fieldMap.get(toFieldName(error) as keyof T) ?? ''
    return prefix + ' ' + toMessage(error)
  })
}

export const toFieldName = (error: ValidationError.WithFieldTree): string => {
  return error.fieldTree().name().split('.').at(-1) ?? ''
}

export const toMessage = (error: ValidationError): string => {
  switch (error.kind) {
    case 'required':
      return 'is required.'
    case 'min':
      const minError = error as MinValidationError
      return `Minimum amount: ${minError.min}`
    case 'max':
      const maxError = error as MaxValidationError
      return `Cannot exceed: ${maxError.max}`
    case 'minLength':
      const minLength = error as MinLengthValidationError
      return `Must have at least ${minLength.minLength} item(s).`
    case 'maxLength':
      const maxLength = error as MaxLengthValidationError
      return `Cannot exceed ${maxLength.maxLength} item(s).`
    default:
      return error.kind ?? 'Validation Error'
  }
}

