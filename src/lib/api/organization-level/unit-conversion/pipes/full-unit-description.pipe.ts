import {inject, Pipe, PipeTransform} from '@angular/core'
import {UnitConversionGraphService} from '../unit-conversion-graph.service'
import {UnitPluralDerivation} from '../unit-plural-derivation.enum'

@Pipe({ name: 'fullUnitDescription', standalone: true })
export class FullUnitDescriptionPipe implements PipeTransform {
  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  transform(unitId: string) : string {
    return this.unitConversionGraphService.getUnitLabel(unitId, UnitPluralDerivation.PLURAL)
  }
}
