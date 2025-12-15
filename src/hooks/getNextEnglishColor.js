// utils/colorGenerator.ts
export const ENGLISH_COLOR_NAMES = [
  '#F72585',
  '#B5179E',
  '#7209B7',
  '#a1ff0a',
  '#480CA8',
  '#3A0CA3',
  '#0a9396',
  '#4361EE',
  '#f72634',
  '#4CC9F0'
]

function toHexFromComputedRgb(rgb) {
  const m = rgb.match(/\d+/g)
  if (!m || m.length < 3) return '#000000'
  const [r, g, b] = m.map(Number)
  const hex = n => n.toString(16).padStart(2, '0')

  return `#${hex(r)}${hex(g)}${hex(b)}`
}

function cssColorToHex(color) {
  const el = document.createElement('div')
  el.style.color = color
  document.body.appendChild(el)
  const rgb = getComputedStyle(el).color
  el.remove()

  return toHexFromComputedRgb(rgb)
}

/**
 * Deterministically assigns a color based on index
 */
export function getColorForIndex(index) {
  const name = ENGLISH_COLOR_NAMES[index % ENGLISH_COLOR_NAMES.length]
  const hex = cssColorToHex(name)

  return { name, hex }
}

/**
 * If your data items have an `id` or `key`,
 * this will always return the same color for that key.
 */
export function getColorForKey(key) {
  // Simple hash → stable but wraps to available colors
  let hash = 0
  const strKey = String(key)
  for (let i = 0; i < strKey.length; i++) {
    hash = (hash << 5) - hash + strKey.charCodeAt(i)
    hash |= 0
  }

  const index = Math.abs(hash) % ENGLISH_COLOR_NAMES.length

  return getColorForIndex(index)
}
