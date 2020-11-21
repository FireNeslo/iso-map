export class World {
  constructor(game, size) {
    this.game = game
    this.unit = [ 40, 20 ]

    this.scale(size)
  }

  scale([ w, h ]) {
    const [ unitX, unitY ] = this.unit

    const width = Math.round(w / unitX)
    const height = Math.round(h / unitY)

    this.width = width
    this.height = height

    const size = Math.max(width, height)

    this.size = [ size, size ]
    this.origin = [ w >> 1, -h >> 1 ]
  }

  fromScreen(screenX, screenY) {
    const [ originX, originY ] = this.origin
    const [ unitX, unitY ] = this.unit

    const worldX = (
      ((screenX - originX) / unitX) +
      ((screenY - originY) / unitY)
    )
    const worldY = (
      ((screenY - originY) / unitY) -
      ((screenX - originX) / unitX)
    )

    return [ worldX >> 1, worldY >> 1 ]
  }
  toScreen(worldX, worldY) {
    const [ originX, originY ] = this.origin
    const [ unitX, unitY ] = this.unit

    const screenX = originX + (worldX - worldY) * unitX
    const screenY = originY + (worldX + worldY) * unitY

    return [ screenX, screenY ]
  }
}
