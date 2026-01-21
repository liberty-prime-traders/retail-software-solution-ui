import {NgClass} from '@angular/common'
import {Component, computed, inject, Input, model, OnInit, Signal, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Field, form} from '@angular/forms/signals'
import {PrimeTemplate} from 'primeng/api'
import {BlockUI} from 'primeng/blockui'
import {Button} from 'primeng/button'
import {InputText} from 'primeng/inputtext'
import {Panel} from 'primeng/panel'
import {PickList} from 'primeng/picklist'
import {Select} from 'primeng/select'
import {Category} from '../../../../api/organization-level/category/category.model'
import {CategoryService} from '../../../../api/organization-level/category/category.service'
import {ProductGroup} from '../../../../api/organization-level/product-group/product-group.model'
import {ProductGroupService} from '../../../../api/organization-level/product-group/product-group.service'
import {ProductStatus} from '../../../../api/organization-level/product/product-status.enum'
import {Product} from '../../../../api/organization-level/product/product.model'
import {ProductService} from '../../../../api/organization-level/product/product.service'
import {Tag} from '../../../../api/organization-level/tag/tag.model'
import {TagService} from '../../../../api/organization-level/tag/tag.service'
import {UnitGroupService} from '../../../../api/organization-level/unit-group/unitgroup.service'
import {UnitValue} from '../../../../api/organization-level/unit-value/unitvalue.model'
import {UnitValueService} from '../../../../api/organization-level/unit-value/unitvalue.service'
import {SelectItemType, ToSelectItemOptions, toSelectItems} from '../../../../utils/types/select-item.type'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {ProductFormDefinition} from './product-form.definition'
import {ProductFormTagDisplayComponent} from './tag-display.component'

@Component({
  selector: 'rts-product-form',
  templateUrl: 'product-form.component.html',
  standalone: true,
  imports: [
    InputText,
    FormButtonsComponent,
    FormFieldComponent,
    Select,
    Field,
    Panel,
    ProductFormTagDisplayComponent,
    NgClass,
    FormsModule,
    PickList,
    PrimeTemplate,
    Button,
    BlockUI
  ]
})
export class ProductFormComponent extends BaseFormComponent<ProductService> implements OnInit {

  private readonly productService = inject(ProductService)
  private readonly productGroupService = inject(ProductGroupService)
  private readonly categoryService = inject(CategoryService)
  private readonly unitValueService = inject(UnitValueService)
  private readonly unitGroupService = inject(UnitGroupService)
  private readonly tagService = inject(TagService)
  protected override apiService: ProductService =  this.productService

  @Input()
  set product(product: Product|null) {
    if (product) {
      this.originalProduct.set(product)
      this.productFormValue.set(ProductFormDefinition.convertToFormModel(product))
      this.selectedTags.set(Array.from(product.activeTags ?? []))
    }
  }

  readonly originalProduct = signal<Product|undefined>(undefined)

  private readonly productTags = this.tagService.productTags

  readonly selectedTags = model<Partial<Tag>[]>([])

  readonly originalTagIds = computed(() =>
    new Set(this.originalProduct()?.activeTags?.map(tag => String(tag.id)) ?? [])
  )

  readonly productIsInactive = computed(() =>
    this.originalProduct() && this.originalProduct()?.status !== ProductStatus.ACTIVE
  )

  readonly availableTags = computed(() =>
    this.productTags().filter(tag => !this.originalTagIds().has(String(tag.id)))
  )

  readonly productFormValue = signal<ProductFormDefinition.ProductFormModel>(
    ProductFormDefinition.defaultProductFormModel
  )

  readonly dependenciesLoading = computed(() =>
    this.productGroupService.selectLoading()
    || this.unitValueService.selectLoading()
    || this.unitGroupService.selectLoading()
    || this.categoryService.selectLoading()
    || this.tagService.selectLoading()
  )

  private readonly productGroupDropdownConfig: ToSelectItemOptions<Category, ProductGroup> = {
    itemValueBy: (productGroup: ProductGroup) => productGroup.id,
    itemLabelBy: (productGroup: ProductGroup) => productGroup.groupName ?? '',
    groupBy: (productGroup: ProductGroup) => productGroup.categoryId ?? '',
    groupLabelBy: (category: Category) => category.categoryName ?? '',
    groupValueBy: (category: Category) => category.id
  }

  readonly productGroups = computed(() => {
    const productGroups = this.productGroupService.selectAll()
    const categories = this.categoryService.productCategories()
    return toSelectItems<Category, ProductGroup>(productGroups, this.productGroupDropdownConfig, categories)
  })

  readonly unitValues: Signal<Array<SelectItemType<UnitValue>>> = computed(() => {
    const result: Array<SelectItemType<UnitValue>> = []
    this.unitValueService.selectAllAsMap().forEach((values, key) => {
      result.push({
        label: this.unitGroupService.selectForId(key)?.name ?? '',
        value: key,
        items: values.map(value => ({label: value.name ?? '', value: value.id}) )
      })
    })
    return result
  })

  readonly productForm = form(this.productFormValue, ProductFormDefinition.productFormSchema)
  readonly productFormFields = ProductFormDefinition.fieldMap

  override ngOnInit() {
    super.ngOnInit()
    this.productGroupService.fetch()
    this.unitGroupService.fetch()
    this.unitValueService.fetch()
    this.tagService.fetch()
    this.categoryService.fetch()
  }

  resetForm() {
    this.productFormValue.set(ProductFormDefinition.convertToFormModel(this.originalProduct()))
    this.selectedTags.set(Array.from(this.originalProduct()?.activeTags ?? []))
  }

  onTagMove() {
    this.selectedTags.set([...this.selectedTags()])
    this.updateTagsInFormModel()
  }

  upsertProduct() {
    const updatedProduct: Partial<Product> = ProductFormDefinition.convertToBackendModel(this.productFormValue())
    if (updatedProduct.id) {
      this.productService.put(updatedProduct)
    } else {
      this.productService.post(updatedProduct)
    }
    this.savedAtLeastOnce.set(true)
  }

  deactivateProduct() {
    if (this.productFormValue()?.id) {
      this.productService.deactivateProduct(this.productFormValue()?.id)
    }
  }

  reactivateProduct() {
    if (this.productFormValue()?.id) {
      this.productService.reactivateProduct(this.productFormValue()?.id)
    }
  }

  updateTagsInFormModel() {
    const formValue = this.productFormValue()
    const selectedTagIds = new Set(this.selectedTags().map(tag => String(tag.id)))
    formValue.tagsToAdd = new Set(
      Array.from(selectedTagIds).filter(tagId => !this.originalTagIds().has(tagId))
    )
    formValue.tagsToRemove = new Set(
      Array.from(this.originalTagIds()).filter(tagId => !selectedTagIds.has(tagId))
    )
    this.productFormValue.set(formValue)
  }
}
