import { asyncIterableToArray } from '#util'
import {
  CloseTimeline,
  NeverReachTimelineError,
  Timeline,
  TimelineError,
  TimelineTimer,
  TimelineInstanceOf,
} from '@johngw/timeline'

let timeline: Timeline

beforeEach(() => {
  timeline = new Timeline(
    '--1--{foo: bar}--[a,b]--true--T--false--F--null--N--E--E(err foo)--T10--X--<Date>-|',
  )
})

test('Timeline', async () => {
  expect(
    (await asyncIterableToArray(timeline)).map((x) => x.get()),
  ).toStrictEqual([
    ...dashes(2),
    1,
    ...dashes(2),
    { foo: 'bar' },
    ...dashes(2),
    ['a', 'b'],
    ...dashes(2),
    true,
    ...dashes(2),
    true,
    ...dashes(2),
    false,
    ...dashes(2),
    false,
    ...dashes(2),
    null,
    ...dashes(2),
    null,
    ...dashes(2),
    new TimelineError(),
    ...dashes(2),
    new TimelineError('err foo'),
    ...dashes(2),
    expect.any(TimelineTimer),
    ...dashes(2),
    new NeverReachTimelineError(),
    ...dashes(2),
    new TimelineInstanceOf('Date'),
    ...dashes(1),
    CloseTimeline,
  ])
})

test('displayTimelinePosition', async () => {
  expect(timeline.displayTimelinePosition()).toBe(
    ` --1--{foo: bar}--[a,b]--true--T--false--F--null--N--E--E(err foo)--T10--X--<Date>-|
^`,
  )

  await timeline.next()
  expect(timeline.displayTimelinePosition()).toBe(
    `
--1--{foo: bar}--[a,b]--true--T--false--F--null--N--E--E(err foo)--T10--X--<Date>-|
^
`.trim(),
  )

  await timeline.next()
  await timeline.next()
  await timeline.next()
  await timeline.next()
  await timeline.next()
  await timeline.next()
  expect(timeline.displayTimelinePosition()).toBe(
    `
--1--{foo: bar}--[a,b]--true--T--false--F--null--N--E--E(err foo)--T10--X--<Date>-|
               ^
`.trim(),
  )
})

function dashes(amount: number) {
  return new Array(amount).fill(undefined)
}
