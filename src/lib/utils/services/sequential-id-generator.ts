import {Injectable, signal} from '@angular/core'

@Injectable({providedIn: 'root'})
export class SequentialIdGenerator {
  private readonly currentId = signal(0)

  next(): number {
    const id = this.currentId()
    this.currentId.set(id + 1)
    return id
  }
}
