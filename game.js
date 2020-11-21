import { Map } from './map.js'
import { clamp } from './utils/math.js'
import { World } from './world.js'


export class Game {
  constructor({ canvas, map }) {
    const { width, height } = canvas
    const size = [ width, height ]

    this.canvas = canvas  
    this.context = canvas.getContext("2d")
    this.world = new World(this, size)
    this.map = new Map(this, map)

    this.selected = [ 0, 0 ]
    this.location = [ 0, 0 ]
    this.scroll = [ 0, 0 ]
  }
  drawTile(x, y, color = 'black') {
    const { context, world } = this
    const { unit: [ unitX, unitY ] } = world
    const [ screenX, screenY ] = world.toScreen(x, y)

    context.fillStyle = color
    context.beginPath()
    context.moveTo(screenX, screenY)
    context.lineTo(screenX - unitX, screenY + unitY)
    context.lineTo(screenX, screenY + unitY * 2)
    context.lineTo(screenX + unitX, screenY + unitY)
    context.closePath()
    context.fill()
  }

  drawMinimap() {
    const { context, world,  map } = this
    const { sheet, width, height } = map

    const { unit: [ unitX ]} = world

    context.beginPath()
    context.rect((world.width * unitX) - width - 5, 5, width, height)
    context.lineWidth = 5
    context.strokeStyle = 'black'
    context.stroke()
    
    context.drawImage(sheet, (world.width * unitX) - width - 5, 5)
  }

  drawCursor() {
    const { selected: [ x, y ] } = this

    this.drawTile(x, y, 'rgba(255, 255, 255, 0.2)')
  }

  onMouseMove(screenX, screenY) {      
    const [ x, y ] = this.world.fromScreen(screenX, screenY)

    const [ sizeX, sizeY ] = this.world.size
    const [ unitX, unitY ] = this.world.unit
    const { width, height } = this.world

    const right = sizeX - 1
    const bottom = sizeY - 1

    const selectedX = clamp(0, x, right)
    const selectedY = clamp(0, y, bottom)

    game.selected = [ selectedX, selectedY ]

    const { scroll } = this

    const TOLERANCE = 2

    const topEdge = unitY * TOLERANCE
    const leftEdge = unitX * TOLERANCE
    const rightEdge = (width - TOLERANCE) * unitX
    const bottomEdge = (height - TOLERANCE) * unitY

    if(screenX < leftEdge) {
      scroll[0] = -0.5
      scroll[1] = 0.5
    } else if(screenX > rightEdge) {
      scroll[0] = 0.5
      scroll[1] = -0.5
    } else if(screenY < topEdge) {
      scroll[0] = -1
      scroll[1] = -1
    } else if(screenY > bottomEdge) {
      scroll[0] = 1
      scroll[1] = 1   
    } else {
      scroll[0] = scroll[1] = 0
    }
  }

  draw() {
    const { world, map, scroll, location } = this
    const [ sizeX, sizeY ] = world.size

    const { tiles } = map

    const [ offsetX, offsetY ] = location

    for (let x = 0; x < sizeX; x++) {
      const mapX = x + offsetX|0
      const row = tiles[mapX]
      for (let y = 0; y < sizeY; y++) {
        const mapY = y + offsetY|0
        if(!row) {
          this.drawTile(x, y, 'black')
        } else if(!row[mapX]) {
          this.drawTile(x, y, 'black')
        } else {
          this.drawTile(x, y, tiles[mapX][mapY])
        }
      }
    }

    this.drawCursor()
    this.drawMinimap()


    const minX = -sizeX >> 1
    const minY = -sizeX >> 1
    const maxX = map.width - (sizeX >> 1)
    const maxY = map.height - (sizeY >> 1)
    
    const locationX = location[0] + scroll[0]
    const locationY = location[1] + scroll[1]

    location[0] = clamp(minX, locationX, maxX)
    location[1] = clamp(minY, locationY, maxY)

  }
}
