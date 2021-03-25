export type JSONType =
  | string
  | number
  | { [key: string]: JSONType }
  | JSONType[]
  | boolean
  | null;
// export type YAMLType = JSONType;

export function isArrayOf<T>(
  how: (x: unknown) => x is T,
  what: unknown,
): what is T[] {
  return Array.isArray(what) && what.every(how);
}
export function isObjectOf<T>(
  how: (x: unknown) => x is T,
  what: unknown,
): what is { [key: string]: T } {
  return typeof what === "object" && what != null &&
    Reflect.ownKeys(what).length == Object.keys(what).length &&
    Object.entries(what).every(([_, v]) => how(v));
}
export function isJSONType(what: unknown): what is JSONType {
  return (["string", "number", "boolean"].includes(typeof what)) ||
    isObjectOf(isJSONType, what) || isArrayOf(isJSONType, what) ||
    (what === null);
}

export type IdPartial<T extends { id: unknown }> = Partial<T> & Pick<T, "id">;