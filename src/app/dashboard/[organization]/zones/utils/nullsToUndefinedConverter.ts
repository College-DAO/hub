function isWritable<T extends Record<string, unknown>>(obj: T, key: keyof T) {
  const desc =
    Object.getOwnPropertyDescriptor(obj, key) ||
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), key) ||
    {};
  return Boolean(desc.writable);
}

// export function nullsToUndefined<T>(obj: T): RecursivelyReplaceNullWithUndefined<T> {
//   if (obj === null || obj === undefined) {
//     return undefined as never;
//   }

//   if (typeof obj === 'object' || Array.isArray(obj)) {
//     for (const key in obj) {
//       if (isWritable(obj, key)) {
//         obj[key] = nullsToUndefined(obj[key]) as never;
//       }
//     }
//   }
//   return obj as never;
// }

type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
  ? RecursivelyReplaceNullWithUndefined<U>[]
  : T extends Record<string, unknown>
  ? { [K in keyof T]: RecursivelyReplaceNullWithUndefined<T[K]> }
  : T;
