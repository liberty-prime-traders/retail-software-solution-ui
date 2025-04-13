import {CommonModule} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {Location} from 'lib/api/location/location.model'
import {LocationService} from 'lib/api/location/location.service'
import {Organization} from 'lib/api/organization/organization.model'
import {LocalStorageService} from 'lib/utils/services/local-storage.service'
import {LocalStorageKey} from 'lib/utils/types/local-storage-key.enum'
import {Select} from 'primeng/select'
import {Subject, takeUntil} from 'rxjs'

@Component({
  standalone: true,
  selector: 'rts-select-location',
  templateUrl: 'select-location.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Select
  ]
})
export class SelectLocationComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly formBuilder = inject(FormBuilder)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly locationService = inject(LocationService)

  readonly locations$ = this.locationService.selectAll$()
  readonly loading$ = this.locationService.selectLoading$()

  currentLocation: Location | null = null
  currentOrganization: Organization | null = null

  readonly locationForm = this.formBuilder.nonNullable.group({
    location: [this.formBuilder.control<Location | null>(null), [Validators.required]],
  })

  get locationControl() {
    return this.locationForm.controls.location
  }

  private destroy$ = new Subject<void>()

  ngOnInit() {
    this.currentLocation = this.localStorageService.getItem<Location>(LocalStorageKey.LOCATION)
    this.currentOrganization = this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION)
    
    if (this.currentOrganization?.id) {
      this.locationService.refetch()
    }

    if (this.currentLocation?.id) {
      this.locationControl.setValue(this.currentLocation)
    }

    this.locationControl.valueChanges
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.localStorageService.setItem(LocalStorageKey.LOCATION, value)
        this.currentLocation = value
        this.router.navigate(['/secure'])
      })
  }

  resetForm() {
    this.locationForm.reset()
  }

  submitForm() {
    console.log(this.locationForm.getRawValue())
  }

  compareLocations(option1: any, option2: any): boolean {
    return option1 && option2 ? option1?.name === option2?.name : option1 === option2;
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
