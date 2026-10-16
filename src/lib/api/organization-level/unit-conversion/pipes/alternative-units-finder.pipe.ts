import {inject, Pipe, PipeTransform} from '@angular/core'
import {SelectItem, toSelectItems} from '../../../../utils/types/select-item.type'
import {UnitConversionGraphService} from '../unit-conversion-graph.service'
import {UnitPluralDerivation} from '../unit-plural-derivation.enum'

@Pipe({name: 'alternativeUnitsFinder', standalone: true})
export class AlternativeUnitsFinderPipe implements PipeTransform {

  private readonly unitConversionGraphService = inject(UnitConversionGraphService)

  transform(sourceUnitId: string): SelectItem<string>[] {
    const targets = this.unitConversionGraphService.getTargets(sourceUnitId)
    if (!targets) {
      return []
    }
    return toSelectItems(Array.from(targets.values()), {
      itemLabelBy: target => this.unitConversionGraphService.getUnitLabel(target.id, UnitPluralDerivation.PLURAL),
      itemValueBy: target => target.id
    })
  }
}
