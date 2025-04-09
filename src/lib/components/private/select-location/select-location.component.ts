import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';

@Component({
  standalone: true,
  selector: 'rts-select-location',
  templateUrl: 'select-location.component.html',
  imports: [
    ReactiveFormsModule,
    Select
  ]
})
export class SelectLocationComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder)

  readonly locationForm = this.formBuilder.nonNullable.group({
    location: [null, [Validators.required]],
  })

  resetForm() {
    this.locationForm.reset()
  }

  submitForm() {
    console.log(this.locationForm.getRawValue())
  }

  locations: any[] | undefined;

  selectedLocation: any | undefined;

  ngOnInit() {
    // TODO: replace with actual location data
    this.locations = [
      { name: 'Location 1' },
      { name: 'Location 2' },
      { name: 'Location 3' },
    ];
  }
}
