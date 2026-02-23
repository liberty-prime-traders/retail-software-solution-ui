export const stretchVisibleElement = (elementId: string): void => {
  const el = document.getElementById(elementId)
  if (el) {
    const viewportHeight = window.innerHeight
    const elementTop = el.getBoundingClientRect().top
    const desiredHeight = viewportHeight - elementTop - 25
    el.style.height = `${desiredHeight}px`
  }
}
