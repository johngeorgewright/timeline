import { staticImplements, timeout } from '#util'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

/**
 * Represents a dash in a timeline.
 *
 * @remarks
 * A dash signifies nothing happening. However, under the hood,
 * it's a 1ms delay.
 */
@staticImplements<TimelineParsable<TimelineItemDash>>()
export class TimelineItemDash extends TimelineItem<undefined> {
  constructor() {
    super('-')
  }

  get() {
    return undefined
  }

  override async onReach() {
    return timeout(1)
  }

  static parse(timeline: string) {
    return timeline.startsWith('-')
      ? ([new TimelineItemDash(), timeline.slice(1)] as const)
      : undefined
  }
}
