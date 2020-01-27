import { createImage } from './images'
import { getDriver } from '../../../db/neo4j'
import { cleanDatabase } from '../../../db/factories'

const driver = getDriver()
const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}'

afterEach(async () => {
  await cleanDatabase()
})

describe('create', () => {
  let imageInput
  beforeEach(() => {
    imageInput = {
      url: '/path/to/image',
      alt: 'A description of the image',
      upload: {
        filename: 'image.jpg',
        mimetype: 'image/jpeg',
        encoding: '7bit',
        createReadStream: () => ({
          pipe: () => ({
            on: (_, callback) => callback(),
          }),
        }),
      },
    }
  })

  it('creates an `Image` node', async () => {
    const session = driver.session()
    const writeTxResultPromise = session.writeTransaction(async transaction => {
      return createImage({ imageInput, transaction })
    })
    await expect(writeTxResultPromise).resolves.toMatchObject({
      url: expect.stringMatching(new RegExp(`^/uploads/${uuid}-image.jpg`)),
      alt: 'A description of the image',
    })
  })

  it.skip('automatically creates different image sizes', async () => {
    const session = driver.session()
    const writeTxResultPromise = session.writeTransaction(async transaction => {
      return createImage({ imageInput, transaction })
    })
    await expect(writeTxResultPromise).resolves.toEqual({
      url: expect.any(String),
      alt: expect.any(String),
      urlW34: expect.stringMatching(new RegExp(`^/uploads/W34/${uuid}-image.jpg`)),
      urlW160: expect.stringMatching(new RegExp(`^/uploads/W160/${uuid}-image.jpg`)),
      urlW320: expect.stringMatching(new RegExp(`^/uploads/W320/${uuid}-image.jpg`)),
      urlW640: expect.stringMatching(new RegExp(`^/uploads/W640/${uuid}-image.jpg`)),
      urlW1024: expect.stringMatching(new RegExp(`^/uploads/W1024/${uuid}-image.jpg`)),
    })
  })

  it.todo('saves image files')
})

describe('delete', () => {
  it.todo('wipes out `Image` node')
  it.todo('does not delete `Image` node')
  it.todo('deletes image files')
})
