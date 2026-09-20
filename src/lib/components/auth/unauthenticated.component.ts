import {Component} from '@angular/core'
import {GoogleAuthComponent} from './google/google-auth.component'

@Component({
  selector: 'rts-unauthenticated',
  imports: [
    GoogleAuthComponent
  ],
  template: `
    <div class="flex flex-column align-items-center">
      <h1>You are logged out</h1>
      <rts-google-auth/>
      <div class="h-2rem"></div>
    </div>
  `
})
export class UnauthenticatedComponent {}
