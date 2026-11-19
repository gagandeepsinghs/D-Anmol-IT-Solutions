import { MongoClient } from 'mongodb'
import { corporateSyllabusFolder, courseSyllabusFolders } from '../../src/data/courseSyllabusFolders.js'

const databaseClients = new Map()
const allowedFolders = new Set([...Object.values(courseSyllabusFolders), corporateSyllabusFolder])

export class ModuleImageStorageUnavailableError extends Error {
  constructor(message, cause) {
    super(message, { cause })
    this.name = 'ModuleImageStorageUnavailableError'
    this.statusCode = 503
  }
}

export function getModuleImageKey(folder, moduleValue) {
  const moduleNumber = Number(moduleValue)
  if ((!allowedFolders.has(folder) && (!folder || folder.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folder)))
    || !Number.isInteger(moduleNumber) || moduleNumber < 1 || moduleNumber > 99) {
    return null
  }

  return `${folder}:${String(moduleNumber).padStart(2, '0')}`
}

export function getModuleImageParams(request) {
  const url = new URL(request.url, 'http://localhost')
  const folder = url.searchParams.get('folder')
  const moduleNumber = url.searchParams.get('module')
  const key = getModuleImageKey(folder, moduleNumber)

  if (!key) return null

  return { folder, moduleNumber: key.split(':').pop(), key }
}

export async function getModuleImageCollection() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new ModuleImageStorageUnavailableError('Set MONGODB_URI to connect the image manager to MongoDB.')

  const databaseName = process.env.MONGODB_DB || ''
  if (!databaseName) throw new ModuleImageStorageUnavailableError('Set MONGODB_DB to choose the image database.')
  const clientKey = `${uri}\n${databaseName}`
  let clientPromise = databaseClients.get(clientKey)

  if (!clientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    clientPromise = client.connect()
      .then(() => client.db(databaseName))
      .catch((error) => {
        databaseClients.delete(clientKey)
        throw new ModuleImageStorageUnavailableError(
          'Unable to connect to MongoDB. Confirm the service is running and the connection settings are correct.',
          error,
        )
      })
    databaseClients.set(clientKey, clientPromise)
  }

  const database = await clientPromise
  return database.collection('courseModuleImages')
}
