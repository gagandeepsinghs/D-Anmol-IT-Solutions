const maximumSelectedImageBytes = 20 * 1024 * 1024
const maximumUploadImageBytes = 3 * 1024 * 1024
const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

function readBlobAsBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = () => reject(new Error('Could not read the selected image.'))
    reader.readAsDataURL(blob)
  })
}

function encodeWebp(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not optimize the selected image.'))
    }, 'image/webp', quality)
  })
}

async function loadImage(file) {
  if (typeof createImageBitmap === 'function') {
    const image = await createImageBitmap(file)
    return { image, dispose: () => image.close() }
  }

  const imageUrl = URL.createObjectURL(file)
  const image = new Image()
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = () => reject(new Error('Could not open the selected image.'))
      image.src = imageUrl
    })
  } catch (error) {
    URL.revokeObjectURL(imageUrl)
    throw error
  }
  return { image, dispose: () => URL.revokeObjectURL(imageUrl) }
}

export async function prepareImageUpload(file) {
  if (file.size >= maximumSelectedImageBytes) {
    throw new Error('Choose an image smaller than 20 MB.')
  }
  if (!supportedImageTypes.has(file.type)) {
    throw new Error('Choose a JPEG, PNG or WebP image.')
  }
  if (file.size === 0) {
    throw new Error('Choose a non-empty image file.')
  }
  if (file.size <= maximumUploadImageBytes) {
    return { contentType: file.type, data: await readBlobAsBase64(file) }
  }
  const { image, dispose } = await loadImage(file)
  try {
    const maximumDimension = 1920
    let dimension = Math.min(maximumDimension, Math.max(image.width, image.height))
    let quality = 0.9
    const canvas = document.createElement('canvas')

    for (let attempt = 0; attempt < 24; attempt += 1) {
      const scale = dimension / Math.max(image.width, image.height)
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Could not prepare the selected image for upload.')
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      const blob = await encodeWebp(canvas, quality)
      if (blob.type !== 'image/webp') {
        throw new Error('This browser cannot optimize large images to WebP.')
      }
      if (blob.size <= maximumUploadImageBytes) {
        return { contentType: blob.type, data: await readBlobAsBase64(blob) }
      }

      if (quality > 0.62) {
        quality = Math.max(0.62, quality - 0.1)
      } else if (dimension > 320) {
        dimension = Math.max(320, Math.floor(dimension * 0.8))
        quality = 0.9
      } else {
        break
      }
    }

    throw new Error('Could not optimize this image enough to upload. Please choose a smaller image.')
  } finally {
    dispose()
  }
}
