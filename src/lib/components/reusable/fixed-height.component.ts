import {AfterViewInit, Component, HostListener} from '@angular/core'

@Component({template: ''})
export abstract class FixedHeightComponent implements AfterViewInit {
  protected abstract readonly fixedHeightElementId: string

  ngAfterViewInit() {
    this.adjustCardHeight()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // this.adjustCardHeight()
  }

  private adjustCardHeight() {
    const card = document.querySelector(`#${this.fixedHeightElementId}`) as HTMLElement
    if (card) {
      const topPosition = card.getBoundingClientRect().top
      const heightToBottom = window.innerHeight - topPosition
      card.style.maxHeight = `${heightToBottom}px`
      card.classList.add('overflow-y-auto')
    }
  }
}
