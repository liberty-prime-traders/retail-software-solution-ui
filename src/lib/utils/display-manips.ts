export const stretchVisibleElement = (elementIds: string[]): void => {
  elementIds.filter(Boolean).forEach(element => {
    const el = document.getElementById(element)
    if (el) {
      const viewportHeight = window.innerHeight
      const elementTop = el.getBoundingClientRect().top
      const desiredHeight = viewportHeight - elementTop - 25
      el.style.height = `${desiredHeight}px`
      return
    }
  })
}
