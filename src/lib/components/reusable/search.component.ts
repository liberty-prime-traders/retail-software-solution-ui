import {Component, input} from '@angular/core'
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms'
import {IconField} from 'primeng/iconfield'
import {InputIcon} from 'primeng/inputicon'
import {InputText} from 'primeng/inputtext'

@Component({
  selector: 'rts-search',
  imports: [
    InputText,
    InputIcon,
    IconField,
    FormsModule,
    ReactiveFormsModule

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
               [formControl]="searchValueControl()"
        />
      </p-icon-field>
    </div>
  `
})
export class SearchComponent {
  readonly searchValueControl = input<FormControl>(new FormControl(''))
  readonly placeholder = input<string>('Search...')

}
