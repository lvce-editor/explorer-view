type ObjectWithProperty<Options extends string> = {
  [key in Options]: unknown
}

export const hasProperty = <K extends string>(object: unknown, key: K): object is ObjectWithProperty<K> => {
  return !!object && typeof object === 'object' && key in object
}
