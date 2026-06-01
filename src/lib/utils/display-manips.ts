export const stretchVisibleElement =
  (elementId: string, useMinHeight = true, padding = 0, stopBefore = ''): void => {
    const el = document.getElementById(elementId)
    if (el) {
      const bottom = getBottom(stopBefore)
      const elementTop = el.getBoundingClientRect().top
      const desiredHeight = bottom - elementTop - padding
      if (useMinHeight) {
        el.style.minHeight = `${desiredHeight}px`
      } else {
        el.style.height = `${desiredHeight}px`
      }
    }
  }

const getBottom = (stopBefore = '') => {
  const viewportHeight = window.innerHeight
  if (stopBefore) {
    const stopBeforeEl = document.getElementById(stopBefore)
    if (stopBeforeEl) {
      const boundingRect = stopBeforeEl.getBoundingClientRect()
      return viewportHeight - boundingRect.height - 30
    }
  }
  return viewportHeight
}
