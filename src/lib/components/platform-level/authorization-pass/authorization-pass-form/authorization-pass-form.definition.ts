import {required, schema} from '@angular/forms/signals'
import {AuthorizationPass} from '../../../../api/platform-level/authorization-pass/authorization-pass.model'
import {PassType} from '../../../../api/platform-level/authorization-pass/pass-type.enum'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'

export namespace AuthorizationPassFormDefinition {
  export interface AuthorizationPassFormModel {
    id: string
    passType: PassType | ''
    maxUseCount: number
    assignedToId: string
    expiresOn: Date | null
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
    expiresOn: null,
  }

  export const formSchema = schema<AuthorizationPassFormModel>((path) => {
    required(path.passType)

    required(
      path.assignedToId,
      {when: ({valueOf}) => valueOf(path.id) === ''}
    )
  })

  export const convertToFormModel = (
    zonedDatesService: ZonedDatesService, pass?: AuthorizationPass
  ): AuthorizationPassFormModel => ({

    id: pass?.id as string ?? '',
    passType: pass?.passType ?? '',
    maxUseCount: pass?.maxUseCount ?? 1,
    assignedToId: pass?.assignedToId ?? '',
    expiresOn: zonedDatesService.fromUTCToZonedDate(pass?.expiresOn)
  })

  export const convertToBackendModel = (
    formValue: AuthorizationPassFormModel, zonedDatesService: ZonedDatesService
  ): Partial<AuthorizationPass> => ({

    id: formValue.id,
    passType: formValue.passType as PassType,
    maxUseCount: formValue.maxUseCount,
    assignedToId: formValue.assignedToId,
    expiresOn: zonedDatesService.toZonedISOString(formValue.expiresOn)
  })
}
