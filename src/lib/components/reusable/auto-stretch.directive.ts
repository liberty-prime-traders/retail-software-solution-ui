import {AfterViewInit, Directive, ElementRef, inject, Input, OnDestroy} from '@angular/core'
import {Subscription} from 'rxjs'
import {stretchVisibleElement} from '../../utils/display-manips'
import {AutoStretchService} from './auto-stretch.service'

@Directive({selector: '[rtsAutoStretch]'})
export class AutoStretchDirective implements AfterViewInit, OnDestroy {

  @Input('rtsAutoStretch') elementId = ''
  private readonly el = inject(ElementRef<HTMLElement>)
  private readonly autoStretchService = inject(AutoStretchService)
  private readonly subscription = new Subscription()

  private get targetId(): string {
    return this.elementId || this.el.nativeElement.id
  }

  ngAfterViewInit(): void {
    this.stretch()
    this.subscription.add(this.autoStretchService.stretch$.subscribe(() => this.stretch()))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  private stretch(): void {
    stretchVisibleElement(this.targetId)
  }
}
