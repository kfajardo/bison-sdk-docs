type Box = { left: number; top: number; width: number; height: number }

export function cropVisualizerTarget(
  viewport: Box,
  demo: Box,
  target: Box,
  [targetX, targetY, frameX, frameY]: readonly [number, number, number, number],
) {
  return {
    left: viewport.width * frameX - (target.left - demo.left + target.width * targetX),
    top: viewport.height * frameY - (target.top - demo.top + target.height * targetY),
  }
}

export function fitVisualizerTarget(viewport: Box, demo: Box, padding = 24) {
  const scale = Math.min((viewport.width - padding * 2) / demo.width, (viewport.height - padding * 2) / demo.height, 1)
  return { scale, left: (viewport.width - demo.width * scale) / 2, top: (viewport.height - demo.height * scale) / 2 }
}

export function closestConnector(from: Box, target: Box, clip: Box) {
  const visible = {
    left: Math.max(target.left, clip.left),
    top: Math.max(target.top, clip.top),
    width: Math.min(target.left + target.width, clip.left + clip.width) - Math.max(target.left, clip.left),
    height: Math.min(target.top + target.height, clip.top + clip.height) - Math.max(target.top, clip.top),
  }
  const to = visible.width > 0 && visible.height > 0 ? visible : target
  const [startX, endX] = closestAxis(from.left, from.width, to.left, to.width)
  const [startY, endY] = closestAxis(from.top, from.height, to.top, to.height)
  return { startX, startY, endX, endY }
}

function closestAxis(a: number, aSize: number, b: number, bSize: number): [number, number] {
  const aEnd = a + aSize
  const bEnd = b + bSize
  if (aEnd < b) return [aEnd, b]
  if (bEnd < a) return [a, bEnd]
  const overlap = (Math.max(a, b) + Math.min(aEnd, bEnd)) / 2
  return [overlap, overlap]
}
