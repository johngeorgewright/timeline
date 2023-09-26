import { staticImplements } from '@johngw/timeline/staticImplements'
import { TimelineParsable, TimelineItem } from '@johngw/timeline/TimelineItem'

/**
 * A symbol to represent closing a timeline.
 */
export const CloseTimeline = Symbol.for('@johngw/timeline close timeline')

/**
 * @inheritDoc
 */
export type CloseTimeline = typeof CloseTimeline

/**
 * A timeline item that'll close the stream.
 *
 * @remarks
 * This expects the string representation `|`.
 */
@staticImplements<TimelineParsable<TimelineItemClose>>()
export class TimelineItemClose extends TimelineItem<CloseTimeline> {
  constructor() {
    super('|')
  }

  get(): CloseTimeline {
    return CloseTimeline
  }

  override get finished(): boolean {
    return true
  }

  static readonly #regexp = this.createItemRegExp('\\|')

  static parse(timeline: string) {
    return this.#regexp.test(timeline)
      ? ([new TimelineItemClose(), timeline.slice(1)] as const)
      : undefined
  }
}
