import { expect, test } from 'bun:test'
import { closestConnector, cropVisualizerTarget, fitVisualizerTarget } from './visualizer'

test('crops a full-size component around the selected target', () => {
  const frame = cropVisualizerTarget(
    { left: 0, top: 0, width: 300, height: 200 },
    { left: 0, top: 0, width: 300, height: 500 },
    { left: 40, top: 60, width: 400, height: 100 },
    [0, .5, .32, .5],
  )
  expect(frame.left).toBe(56)
  expect(frame.top).toBe(-10)
})

test('connects the closest visible edges', () => {
  expect(closestConnector(
    { left: 0, top: 40, width: 20, height: 20 },
    { left: 80, top: 0, width: 60, height: 100 },
    { left: 60, top: 20, width: 40, height: 60 },
  )).toEqual({ startX: 20, startY: 50, endX: 80, endY: 50 })
})

test('fits one full component inside the visualizer', () => {
  const frame = fitVisualizerTarget(
    { left: 0, top: 0, width: 600, height: 500 },
    { left: 0, top: 0, width: 400, height: 800 },
  )
  expect(frame.scale).toBeCloseTo(.565)
  expect(frame.left).toBeCloseTo(187)
  expect(frame.top).toBeCloseTo(24)
})
