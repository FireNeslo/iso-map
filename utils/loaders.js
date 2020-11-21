export async function loadSprite(src) {
  const image = new Image()

  await new Promise((resolve, reject) => {
    image.onerror = reject
    image.onload = resolve
    image.src = src
  })

  const sheet = document.createElement('canvas')

  sheet.width = image.naturalWidth
  sheet.height = image.naturalHeight

  const context = sheet.getContext('2d')

  context.drawImage(image, 0, 0)

  return sheet
}
