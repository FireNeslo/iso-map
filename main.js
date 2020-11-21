import { loadSprite } from './utils/loaders.js'
import { Game } from './game.js'

;(async function main() {
  const map = await loadSprite('maps/one.png')
  const canvas = document.querySelector('canvas')
  
  canvas.width = innerWidth
  canvas.height = innerHeight
  
  const game = globalThis.game = new Game({ canvas, map })
  
  canvas.addEventListener('mousemove', ({ offsetX, offsetY }) => {
    game.onMouseMove(offsetX, offsetY)
  })
  canvas.addEventListener('touchmove', ({ 
    touches: [ { clientX, clientY } ] 
  }) => {
    game.onMouseMove(clientX, clientY)
  })

  window.addEventListener('resize', event => {
    game.world.scale([
      canvas.width = innerWidth,
      canvas.height = innerHeight
    ])
  })
  
  requestAnimationFrame(function loop() {
    game.draw()
    requestAnimationFrame(loop)
  })
}())
