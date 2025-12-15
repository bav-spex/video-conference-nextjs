const isObject = val => {
  return val !== null && typeof val === 'object' && !Array.isArray(val)
}

export const markStates = (sobj, self) => {
  if (!isObject(sobj)) {
    throw new Error('mark: invalid sobj, exepect a object')
  }
  const selfKeys = Object.keys(self)

  Object.entries(sobj).forEach(([key, val]) => {
    if (!selfKeys.includes(key)) return false
    if (!Array.isArray(val) && isObject(val) && self[key] !== null) {
      // eslint-disable-next-line no-param-reassign
      self[key] = Object.assign(self[key], val)
    } else {
      // eslint-disable-next-line no-param-reassign
      self = Object.assign(self, { [key]: val })
    }
  })

  return false
}

export const toTitleCase = str => {
  if (!str) return ''

  return (
    str
      // Insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // Trim leading space
      .trim()
      // Capitalize the first letter
      .replace(/^./, match => match.toUpperCase())
  )
}

export const truncateText = (text, limit) => {
  if (!text) return ''

  return text.length > limit ? text.substring(0, limit) + '...' : text
}

export const withEnvPath = path => {
  // if (process.env.NEXT_PUBLIC_ENVIRONEMENT === 'UAT') {
  //   if (process.env.NEXT_PUBLIC_IS_LOCAL === 'NO') {
  //     return `/uat${path}`
  //   }
  // }

  return path
}

export function getLocalStorageItem(key) {
  if (typeof window === 'undefined') return null

  return window.localStorage.getItem(key)
}
