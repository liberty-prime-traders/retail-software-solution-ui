import {inject, Pipe, PipeTransform} from '@angular/core'
import {UnitConversionGraphService} from '../unit-conversion-graph.service'
import {UnitPluralDerivation} from '../unit-plural-derivation.enum'

@Pipe({ name: 'fullUnitDescription', standalone: true })
export class UnitDescriptionPipe implements PipeTransform {
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  transform(unitId: string, value?: number) : string {
    return this.unitConversionGraphService.getUnitLabel(unitId, UnitPluralDerivation.FROM_VALUE, value)
  }
}

@Pipe({ name: 'unitCode', standalone: true })
export class UnitCodePipe implements PipeTransform {
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  transform(unitId: string): string {
    const target = this.unitConversionGraphService.getTargets(unitId)?.get(unitId)
    return target ? target.code : '_'
  }
}
