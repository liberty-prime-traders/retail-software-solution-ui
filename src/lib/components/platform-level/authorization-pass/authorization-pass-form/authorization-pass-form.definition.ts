import {applyWhen, required, schema} from '@angular/forms/signals'
import {AuthorizationPass} from '../../../../api/platform-level/authorization-pass/authorization-pass.model'
import {PassType} from '../../../../api/platform-level/authorization-pass/pass-type.enum'

export namespace AuthorizationPassFormDefinition {
  export interface AuthorizationPassFormModel {
    id: string
    passType: PassType | ''
    maxUseCount: number
    assignedToId: string
    expiresOn: string
  }

  export const fieldMap = new Map<keyof AuthorizationPassFormModel, string>([
    ['passType', 'Pass Type'],
    ['maxUseCount', 'Max Use Count'],
    ['assignedToId', 'Assigned To'],
    ['expiresOn', 'Expires On'],
  ])

  export const defaultFormModel: AuthorizationPassFormModel = {
    id: '',
    passType: PassType.CREATE_ORGANIZATION,
    maxUseCount: 1,
    assignedToId: '',
    expiresOn: '',
  }

  export const formSchema = schema<AuthorizationPassFormModel>((path) => {
    required(path.passType)

    applyWhen(
      path.assignedToId,
      ({valueOf}) => valueOf(path.id) === '',
      (assignedToPath) => required(assignedToPath)
    )
  })

  export const convertToFormModel = (pass?: AuthorizationPass): AuthorizationPassFormModel => ({
    id: pass?.id as string ?? '',
    passType: pass?.passType ?? '',
    maxUseCount: pass?.maxUseCount ?? 1,
    assignedToId: pass?.assignedToId ?? '',
    expiresOn: pass?.expiresOn ?? '',
  })

  export const convertToBackendModel = (formValue: AuthorizationPassFormModel): Partial<AuthorizationPass> => ({
    id: formValue.id,
    passType: formValue.passType as PassType,
    maxUseCount: formValue.maxUseCount,
    assignedToId: formValue.assignedToId,
    expiresOn: formValue.expiresOn,
  })
}
