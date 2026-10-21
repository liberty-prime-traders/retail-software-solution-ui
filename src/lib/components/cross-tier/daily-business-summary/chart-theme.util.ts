/** Theme variables can alias other variables, so the color is resolved through a probe element rather than read raw. */
export const readThemeColor = (cssVariable: string): string => {
  const probe = document.createElement('span')
  probe.style.color = `var(${cssVariable})`
  document.body.appendChild(probe)
  const color = getComputedStyle(probe).color
  probe.remove()
  return color
}

/** Applies opacity to a `#rrggbb` or `rgb(...)` theme color; anything else is returned unchanged. */
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  if (hex) {
    const [red, green, blue] = hex.slice(1).map(channel => parseInt(channel, 16))
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`
  }
  const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i)
  return rgb ? `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${opacity})` : color
}
