import path from 'path'
import uuid from 'uuid/v4'
import slug from 'slug'
import { createWriteStream } from 'fs'

// const widths = [34, 160, 320, 640, 1024]

const localFileUpload = ({ createReadStream, destination }) => {
  return new Promise((resolve, reject) =>
    createReadStream()
      .pipe(createWriteStream(`public${destination}`))
      .on('finish', () => resolve(destination))
      .on('error', reject),
  )
}

export async function createImage({ imageInput, transaction, fileUpload = localFileUpload }) {
  const { alt, blurred, aspectRatio, upload } = imageInput
  const { createReadStream, filename, mimetype } = await upload
  const { name, ext } = path.parse(filename)
  const uniqueFilename = `${uuid()}-${slug(name)}${ext}`

  const url = await fileUpload({
    createReadStream,
    destination: `/uploads/${uniqueFilename}`,
    mimetype,
  })
  const params = { url, alt, blurred, aspectRatio }
  const response = await transaction.run(
    `
    CREATE (image:Image)
    SET image += $params
    RETURN image {.*}
  `,
    { params },
  )
  const [image] = response.records.map(record => record.get('image'))
  return image
}

export function deleteImage({ image, transaction }) {}
