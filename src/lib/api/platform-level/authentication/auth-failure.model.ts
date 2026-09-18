export enum AuthFailureCode {
  INVALID_CREDENTIAL = 'INVALID_CREDENTIAL',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  PROVIDER_MISMATCH = 'PROVIDER_MISMATCH'
}

export interface AuthFailure {
  code: AuthFailureCode
  data?: Record<string, unknown>
}

interface AuthFailureMessage {
  summary: string
  detail: string
}

export const AUTH_FAILURE_MESSAGES: Record<AuthFailureCode, AuthFailureMessage> = {
  [AuthFailureCode.INVALID_CREDENTIAL]: {
    summary: 'Login Failed',
    detail: 'Your credentials could not be verified. Please try again.'
  },
  [AuthFailureCode.ACCOUNT_DISABLED]: {
    summary: 'Account Disabled',
    detail: 'This account has been disabled. Contact your administrator.'
  },
  [AuthFailureCode.PROVIDER_MISMATCH]: {
    summary: 'Provider Mismatch',
    detail: 'This account is linked to a different sign-in method.'
  }
}

export const DEFAULT_AUTH_FAILURE_MESSAGE: AuthFailureMessage = {
  summary: 'Login Failed',
  detail: 'An unexpected error occurred. Please try again.'
}
