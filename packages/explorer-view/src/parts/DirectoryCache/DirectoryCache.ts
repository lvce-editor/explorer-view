import { CacheWorker } from '@lvce-editor/rpc-registry'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

const cacheName = 'lvce-explorer-directories-v1'
const lifetime = 90 * 24 * 60 * 60 * 1000
const maxBytes = 4 * 1024 * 1024
const trailingSlash = /\/$/
const lastSegment = /\/[^/]*\/?$/
const operations = new Map<string, Promise<unknown>>()

const normalize = (uri: string): string => {
  if (URL.canParse(uri)) {
    const url = new URL(uri)
    if (url.pathname !== '/') {
      url.pathname = url.pathname.replace(trailingSlash, '')
    }
    return url.href
  }
  return uri.replace(trailingSlash, '') || '/'
}

const getKey = (uri: string, applicationId: string | undefined): string => {
  return `https://lvce-editor.invalid/explorer-directories/v1/${encodeURIComponent(JSON.stringify([applicationId ?? null, normalize(uri)]))}`
}

// Serialize refresh/removal with pending reads and writes in this explorer worker.
// Entries are also validated at the filesystem before every reuse and after reads.
const enqueue = async <T>(key: string, operation: () => Promise<T>): Promise<T> => {
  const previous = operations.get(key) || Promise.resolve()
  const current = (async (): Promise<T> => {
    try {
      await previous
    } catch {
      // A failed filesystem operation must not block later reads or refreshes.
    }
    return operation()
  })()
  operations.set(key, current)
  try {
    return await current
  } finally {
    if (operations.get(key) === current) {
      operations.delete(key)
    }
  }
}

const getVersion = async (uri: string, applicationId: string | undefined): Promise<string | null> => {
  try {
    const version = await ApplicationRpc.invoke(applicationId, 'FileSystem.getDirectoryVersion', uri)
    return typeof version === 'string' && version.length > 0 ? version : null
  } catch {
    return null
  }
}

const remove = async (key: string): Promise<void> => {
  try {
    await CacheWorker.invoke('Cache.removeCacheStorageItem', key, cacheName)
  } catch {
    // Persistence is optional.
  }
}

const isListing = (value: unknown): value is readonly RawDirent[] => {
  return (
    Array.isArray(value) &&
    value.every((entry: unknown) => {
      if (!entry || typeof entry !== 'object') {
        return false
      }
      const { name, type } = entry as Partial<RawDirent>
      return (
        typeof name === 'string' &&
        name.length > 0 &&
        name !== '.' &&
        name !== '..' &&
        !name.includes('/') &&
        !name.includes('\0') &&
        typeof type === 'number' &&
        Number.isSafeInteger(type) &&
        type >= 0 &&
        type <= 12
      )
    })
  )
}

const get = async (key: string, version: string): Promise<readonly RawDirent[] | null> => {
  try {
    const item = await CacheWorker.invoke('Cache.getCacheStorageJsonItem', key, cacheName)
    if (!item) {
      return null
    }
    const { value } = item
    if (
      value &&
      value.version === version &&
      Number.isFinite(value.expires) &&
      value.expires > Date.now() &&
      value.expires <= Date.now() + lifetime &&
      isListing(value.dirents)
    ) {
      return value.dirents
    }
    await remove(key)
  } catch {
    // Corruption and unavailable Cache Storage are ordinary misses.
  }
  return null
}

export const readDirectory = async (uri: string, applicationId?: string, refresh = false): Promise<readonly RawDirent[]> => {
  const key = getKey(uri, applicationId)
  return enqueue(key, async () => {
    if (refresh) {
      await remove(key)
    }
    const before = await getVersion(uri, applicationId)
    if (before && !refresh) {
      const cached = await get(key, before)
      if (cached) {
        return cached
      }
    }
    // Keep filesystem errors visible even when the optional validator failed.
    const dirents = await ApplicationRpc.invoke(applicationId, 'FileSystem.readDirWithFileTypes', uri)
    if (before && isListing(dirents) && (await getVersion(uri, applicationId)) === before) {
      try {
        const value = { dirents, expires: Date.now() + lifetime, version: before }
        if (new TextEncoder().encode(JSON.stringify(value)).byteLength <= maxBytes) {
          await CacheWorker.invoke('Cache.setCacheStorageJsonItem', key, value, cacheName)
        }
      } catch {
        // Cache failures must not hide a successful listing.
      }
    }
    return dirents
  })
}

export const invalidateParent = async (uri: string, applicationId?: string): Promise<void> => {
  let parent: string
  if (URL.canParse(uri)) {
    const url = new URL(uri)
    url.pathname = url.pathname.replace(lastSegment, '') || '/'
    parent = url.href
  } else {
    parent = uri.slice(0, uri.lastIndexOf('/')) || '/'
  }
  const key = getKey(parent, applicationId)
  await enqueue(key, () => remove(key))
}
