import { asyncIterableToArray } from '../src/util.js'
import {
  CloseTimeline,
  NeverReachTimelineError,
  Timeline,
  TimelineError,
  TimelineTimer,
} from '@johngw/timeline'

test('Timeline', async () => {
  expect(
    (
      await asyncIterableToArray(
        new Timeline(
          '--1--{foo: bar}--[a,b]--true--T--false--F--null--N--E--E(err foo)--T10--X-|'
        )
      )
    ).map((x) => x.get())
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
    ...dashes(1),
    CloseTimeline,
  ])
})

function dashes(amount: number) {
  return new Array(amount).fill(undefined)
}
