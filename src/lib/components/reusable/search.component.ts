import {Component, input, model} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {InputText} from 'primeng/inputtext'

@Component({
  selector: 'rts-search',
  imports: [
    InputText,
    InputIcon,
    IconField,
    FormsModule

  ],
  template: `
    <div class="flex justify-content-end">
      <p-icon-field>
        <p-inputicon>
          <i class="pi pi-search"></i>
        </p-inputicon>
        <input pInputText
               type="text"
               #searchInput
               [placeholder]="placeholder()"
               [(ngModel)]="searchValue"
        />
      </p-icon-field>
    </div>
  `
})
export class SearchComponent {
  readonly searchValue = model<string>('')
  readonly placeholder = input<string>('Search...')

}
