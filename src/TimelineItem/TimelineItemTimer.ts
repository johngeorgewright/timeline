import { staticImplements, timeout } from '../util.js'
import { TimelineItem, TimelineParsable } from './TimelineItem.js'

/**
 * A timeline item that represents a timer.
 *
 * @remarks
 * Timers are used in 2 ways. One for simply delaying the stream's
 * content and the other is to expect that a certain amount of time
 * has passed since the previous item.
 */
@staticImplements<TimelineParsable<TimelineItemTimer>>()
export class TimelineItemTimer extends TimelineItem<TimelineTimer> {
  #timer: TimelineTimer

  constructor(ms: number) {
    super(`T${ms}`)
    this.#timer = new TimelineTimer(ms)
  }

  override onReach() {
    this.#timer.start()
    return super.onReach()
  }

  get() {
    return this.#timer
  }

  static readonly #regex = this.createItemRegExp('(T(\\d+))')

  static parse(timeline: string) {
    const result = this.#regex.exec(timeline)
    return result
      ? ([
          new TimelineItemTimer(Number(result[2])),
          timeline.slice(result[1].length),
        ] as const)
      : undefined
  }
}

/**
 * Represents a timer in a timeline.
 */
export class TimelineTimer {
  #started = false
  #start?: number
  #end?: number
  readonly #ms: number
  #promise?: Promise<void>

  constructor(ms: number) {
    this.#ms = ms
  }

  start() {
    this.#started = true
    this.#start = Date.now()
    this.#end = this.#start + this.#ms
    this.#promise = timeout(this.#ms)
  }

  toJSON() {
    return {
      name: 'TimelineTimer',
      finished: this.finished,
      ms: this.#ms,
      started: this.#started,
      timeLeft: this.timeLeft,
    }
  }

  toString() {
    return `TimelineTimer(${this.ms}ms) { ${
      this.finished ? 'finished' : this.#started ? `${this.timeLeft}ms` : ''
    } }`
  }

  get timeLeft() {
    return this.#end === undefined ? this.#end : this.#end - Date.now()
  }

  get started() {
    return this.#started
  }

  get finished() {
    const timeLeft = this.timeLeft
    return timeLeft !== undefined && timeLeft <= 0
  }

  get promise() {
    return this.#promise
  }

  get ms() {
    return this.#ms
  }
}
