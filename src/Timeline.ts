import { asyncIterableToArray, search } from './util'
import { TimelineItemBoolean } from './TimelineItem/TimelineItemBoolean.js'
import { TimelineItemClose } from './TimelineItem/TimelineItemClose.js'
import { TimelineItemError } from './TimelineItem/TimelineItemError.js'
import { TimelineItemNeverReach } from './TimelineItem/TimelineItemNeverReach.js'
import { TimelineItemNull } from './TimelineItem/TimelineItemNull.js'
import { TimelineItemTimer } from './TimelineItem/TimelineItemTimer.js'
import { TimelineItemDefault } from './TimelineItem/TimelineItemDefault.js'
import { TimelineItemDash } from './TimelineItem/TimelineItemDash.js'
import { TimelineItem, TimelineParsable } from './TimelineItem/TimelineItem.js'

/**
 * The configured Timeline parsers.
 */
const Items = [
  TimelineItemDash,
  TimelineItemBoolean,
  TimelineItemClose,
  TimelineItemError,
  TimelineItemNeverReach,
  TimelineItemNull,
  TimelineItemTimer,
  TimelineItemDefault,
] satisfies TimelineParsable<TimelineItem<unknown>>[]

/**
 * The union of configured {@link TimelineItem} instances.
 */
export type ParsedTimelineItem = typeof Items extends Array<infer T>
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends abstract new (...args: any) => any
    ? InstanceType<T>
    : never
  : never

/**
 * The union of configured TimelineItem contained values.
 */
export type ParsedTimelineItemValue = ParsedTimelineItem extends TimelineItem<
  infer V
>
  ? V
  : never

/**
 * Given a timeline, parse it in to a list of {@link TimelineItem} objects.
 */
export class Timeline implements AsyncIterableIterator<ParsedTimelineItem> {
  readonly #unparsed: string
  readonly #parsed: ParsedTimelineItem[]
  #position = -1

  constructor(timeline: string) {
    this.#unparsed = timeline
    this.#parsed = this.#parse(timeline)
  }

  get position() {
    return this.#position
  }

  toString() {
    return this.#unparsed
  }

  async toTimeline() {
    return (await asyncIterableToArray(this))
      .map((x) => x.toTimeline())
      .join('')
  }

  hasMoreItems() {
    return (
      this.#position < this.#parsed.length - 1 &&
      !!this.#parsed
        .slice(this.#position + 1)
        .filter(
          (value) =>
            !(value instanceof TimelineItemDash) &&
            !(value instanceof TimelineItemClose) &&
            !(value instanceof TimelineItemNeverReach) &&
            !(value instanceof TimelineItemTimer && value.get().finished)
        ).length
    )
  }

  toJSON() {
    return this.#parsed
  }

  async next(): Promise<IteratorResult<ParsedTimelineItem, undefined>> {
    if (this.#position >= this.#parsed.length - 1)
      return { done: true, value: undefined }

    const previous = this.#parsed[this.position]
    if (previous) await previous.onPass()

    const value = this.#parsed[++this.#position]
    await value.onReach()

    return { done: false, value }
  }

  startOver() {
    this.#position = -1
  }

  [Symbol.asyncIterator]() {
    return this
  }

  #parse(timeline: string) {
    const results: ParsedTimelineItem[] = []
    let $timeline = timeline.trim()

    while ($timeline.length) {
      const result = search(Items, (Item) => Item.parse($timeline))
      if (!result)
        throw new Error(
          `Cannot find a TimelineParsable capable of parsing ${$timeline}`
        )
      results.push(result[0])
      $timeline = result[1]
    }

    return results
  }
}
