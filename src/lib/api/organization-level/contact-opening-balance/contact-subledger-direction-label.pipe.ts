import {Pipe, PipeTransform} from '@angular/core'
import {ContactSubledgerDirection} from './contact-subledger-direction.enum'

@Pipe({
  name: 'contactSubledgerDirectionLabel',
  standalone: true
})
export class ContactSubledgerDirectionLabelPipe implements PipeTransform {
  transform(value: ContactSubledgerDirection | null | undefined): string {
    switch (value) {
      case ContactSubledgerDirection.PAYABLE:
        return 'We owed them'
      case ContactSubledgerDirection.RECEIVABLE:
        return 'They owed us'
      default:
        return '--'
    }
  }
}
