export function objectHasProperty<T extends object, K extends string | number | symbol>(
  source: T,
  propertyKey: K
): source is T & Record<K, unknown> {
  return propertyKey in source;
}
