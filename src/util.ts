/**
 * Much like Array.prototype.find() however it returns
 * the result of the callback.
 *
 * @group Utils
 * @category Array
 * @example
 * ```
 * console.info(
 *   search(['', '1'], (x) => x && Number(x))
 * )
 * ```
 */
export function search<T, R>(
  array: T[],
  search: (item: T) => R | undefined
): R | undefined {
  let result: R | undefined

  for (const item of array) {
    result = search(item)
    if (result !== undefined) break
  }

  return result
}

/**
 * Consumes an async iterable in to an array.
 *
 * @group Utils
 * @category Iterable
 */
export async function asyncIterableToArray<T>(iterable: AsyncIterable<T>) {
  const array: T[] = []
  for await (const item of iterable) array.push(item)
  return array
}

/**
 * Reduces an async iterable in to a value.
 *
 * @group Utils
 * @category Iterable
 */
export async function asyncIterableReduce<I, O>(
  iterator: AsyncIterable<I>,
  out: O,
  reduce: (out: O, item: I) => O | Promise<O>
) {
  for await (const item of iterator) out = await reduce(out, item)
  return out
}

/**
 * Returns a promise that resolves in `ms` milliseconds.
 *
 * @group Utils
 * @category Async
 */
export function timeout(ms?: number): Promise<void>

export function timeout<T>(
  ms: number,
  value: T,
  signal?: AbortSignal
): Promise<T>

export function timeout<T>(ms?: number, value?: T, signal?: AbortSignal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason)

    const onAbort = () => {
      clearTimeout(timer)
      reject(signal?.reason)
    }

    const timer = setTimeout(
      (x: T) => {
        signal?.removeEventListener('abort', onAbort)
        resolve(x)
      },
      ms,
      value
    )

    signal?.addEventListener('abort', onAbort)
  })
}

/**
 * Use for declaring static interfaces.
 *
 * @group Utils
 * @category Function
 * @example
 * ```
 * interface Comparable<T> {
 *   compare(a: T): number;
 * }
 *
 * interface ComparableStatic<T> extends Type<Comparable<T>> {
 *   compare(a: T, b: T): number;
 * }
 *
 * @staticImplements<ComparableStatic<TableCell>>()
 * class TableCell {
 *   value: number;
 *
 *   compare(a: TableCell): number {
 *     return this.value - a.value;
 *   }
 *
 *   static compare(a: TableCell, b: TableCell): number {
 *     return a.value - b.value;
 *   }
 * }
 * ```
 */
export interface StaticType<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T
}

/**
 * Take from an iterable until the `predicate` returns true.
 *
 * @group Utils
 * @category Iterable
 */
export function* takeUntil<T>(
  iterable: Iterable<T>,
  predicate: (x: T) => boolean
) {
  for (const x of iterable) {
    if (predicate(x)) return
    yield x
  }
}

/**
 * Take from an iterable while a `predicate` returns true.
 *
 * @group Utils
 * @category Iterable
 */
export function takeWhile<T>(
  iterable: Iterable<T>,
  predicate: (x: T) => boolean
) {
  return takeUntil(iterable, (x) => !predicate(x))
}

/**
 * Extract part of a string until a predicate returns true.
 *
 * @group Utils
 * @category String
 */
export function takeCharsUntil(
  string: string,
  predicate: string | ((x: string) => boolean)
) {
  let result = ''
  for (const char of takeUntil(
    string,
    typeof predicate === 'string' ? (x) => x === predicate : predicate
  ))
    result += char
  return result
}
