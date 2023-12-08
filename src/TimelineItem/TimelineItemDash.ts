import { staticImplements } from '@johngw/timeline/staticImplements'
import { TimelineItem, TimelineParsable } from '@johngw/timeline/TimelineItem'

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

  override get finished(): boolean {
    return true
  }

  override async onReach() {
    return this.dash()
  }

  static parse(timeline: string) {
    return timeline.startsWith('-')
      ? ([new TimelineItemDash(), timeline.slice(1)] as const)
      : undefined
  }
}
