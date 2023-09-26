import { staticImplements } from '@johngw/timeline/staticImplements'
import { TimelineItem, TimelineParsable } from '@johngw/timeline/TimelineItem'

/**
 * A timeline item, with the value of `null` that is generated
 * with the shorthand `N`.
 */
@staticImplements<TimelineParsable<TimelineItemNull>>()
export class TimelineItemNull extends TimelineItem<null> {
  constructor() {
    super('N')
  }

  get() {
    return null
  }

  static readonly #regex = this.createItemRegExp('N')

  static parse(timeline: string) {
    return this.#regex.test(timeline)
      ? ([new TimelineItemNull(), timeline.slice(1)] as const)
      : undefined
  }
}
