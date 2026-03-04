import {Injectable} from '@angular/core'
import {Subject} from 'rxjs'

@Injectable({providedIn: 'root'})
export class AutoStretchService {
  private readonly stretchTrigger = new Subject<void>()
  readonly stretch$ = this.stretchTrigger.asObservable()

  triggerStretch(): void {
    this.stretchTrigger.next()
  }
}
