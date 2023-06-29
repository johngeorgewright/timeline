import { staticImplements, ValueOrArrayOrObject, takeCharsUntil } from '#util'
import yaml from 'js-yaml'
import { TimelineItem, TimelineParsable } from '@johngw/timeline/TimelineItem'

/**
 * The values that can be generated by the {@link TimelineItemDefault} item.
 */
export type TimelineItemDefaultValue = ValueOrArrayOrObject<
  string | number | boolean | null
>

/**
 * Attempts to parse anything but a dash with `js-yaml`.
 */
@staticImplements<TimelineParsable<TimelineItemDefault>>()
export class TimelineItemDefault extends TimelineItem<TimelineItemDefaultValue> {
  #value: TimelineItemDefaultValue

  constructor(timeline: string) {
    super(timeline)
    this.#value = yaml.load(timeline) as TimelineItemDefaultValue
  }

  get() {
    return this.#value
  }

  static parse(timeline: string) {
    const unparsed = takeCharsUntil(timeline, '-')
    return unparsed.length
      ? ([
          new TimelineItemDefault(unparsed),
          timeline.slice(unparsed.length),
        ] as const)
      : undefined
  }
}
