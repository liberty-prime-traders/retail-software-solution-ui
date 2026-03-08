import {AfterViewInit, computed, DestroyRef, Directive, ElementRef, inject, input} from '@angular/core'
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import {tap} from 'rxjs/operators'
import {stretchVisibleElement} from '../../utils/display-manips'
import {AutoStretchService} from './auto-stretch.service'

@Directive({selector: '[rtsAutoStretch]'})
export class AutoStretchDirective implements AfterViewInit {

  readonly elementId = input('', {alias: 'rtsAutoStretch'})
  readonly useMinHeight = input(true)

  private readonly el = inject(ElementRef<HTMLElement>)
  private readonly autoStretchService = inject(AutoStretchService)
  private readonly destroyRef = inject(DestroyRef)

  private readonly targetId = computed(() => this.elementId() || this.el.nativeElement.id)

  ngAfterViewInit(): void {
    this.stretch()
    this.autoStretchService.stretch$.pipe(
      tap(() => this.stretch()),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()
  }

  private stretch(): void {
    setTimeout(() => stretchVisibleElement(this.targetId(), this.useMinHeight()), 0)
  }
}
