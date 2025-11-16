type ObjectWithProperty<Options extends string> = {
  [key in Options]: unknown
}

export const hasProperty = <K extends string, T>(object: unknown, key: K): object is ObjectWithProperty<K> => {
  if (!object || typeof object !== 'object' || !(key in object)) {
    return false
  }
  return true
}
