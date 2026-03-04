export const stretchVisibleElement = (elementId: string, useMinHeight = true): void => {
  const el = document.getElementById(elementId)
  if (el) {
    const viewportHeight = window.innerHeight
    const elementTop = el.getBoundingClientRect().top
    const desiredHeight = viewportHeight - elementTop - 25
    if (useMinHeight) {
      el.style.minHeight = `${desiredHeight}px`
    } else {
      el.style.height = `${desiredHeight}px`
    }
  }
}
