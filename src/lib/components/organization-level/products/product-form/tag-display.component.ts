import {NgClass} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {Tag} from '../../../../api/organization-level/tag/tag.model'
import {OrganizationProductFormDefinition} from './organization-product-form.definition'

@Component({
  selector: 'rts-tag-display',
  imports: [
    NgClass
  ],
  template: `
    <span [ngClass]="colorClass()">
      {{prefix()}} {{currentTag().tagName}}
    </span>
  `
})
export class ProductFormTagDisplayComponent {

  readonly productFormValue = input.required<OrganizationProductFormDefinition.ProductFormModel>()
  readonly currentTag = input.required<Tag>()

  readonly isBeingAdded = computed(() =>
    this.productFormValue().tagsToAdd.has(String(this.currentTag().id))
  )

  readonly isBeingRemoved = computed(() =>
    this.productFormValue().tagsToRemove.has(String(this.currentTag().id))
  )

  private readonly color = computed(() =>
    this.isBeingAdded() ? 'green' : this.isBeingRemoved() ? 'red' : 'gray'
  )

  readonly colorClass = computed(() => `text-${this.color()}-600`)

  readonly prefix = computed(() =>
    this.isBeingAdded() ? '+' : this.isBeingRemoved() ? '-' : ''
  )

}
