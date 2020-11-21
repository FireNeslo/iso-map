export class Map {
  constructor(game, sheet) {
    this.game = game
    this.sheet = sheet

    const context = sheet.getContext('2d')

    const { width, height } = sheet

    this.width = +width
    this.height = +height

    const { data: tiles } = context.getImageData(0, 0, width, height)

    this.tiles = Array.from({ length: width }, (_, x) => {
      return Array.from({ length: height }, (_, y) => {
        const index = (y * width + x) * 4

        const red = tiles[index]
        const green = tiles[index + 1]
        const blue = tiles[index + 2]
        const alpha = tiles[index + 3] / 256

        const color = `rgba(${red},${green},${blue}, ${alpha})`

        return color
      })
    })
  }
}
