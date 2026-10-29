import { expect, test } from '@jest/globals'
import { CacheWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { invalidateParent, readDirectory } from '../src/parts/DirectoryCache/DirectoryCache.ts'

interface Fixture extends Disposable {
  readonly calls: string[]
  changeDuringRead: boolean
  entries: { name: string; type: number }[]
  readonly listingCount: number
  listingError: boolean
  onRead: () => Promise<void>
  statUnavailable: boolean
  readonly stored: Map<string, any>
  unavailable: boolean
  version: string | null
}

const createFixture = (): Fixture => {
  const stored = new Map<string, any>()
  const calls: string[] = []
  let version: string | null = 'connection-a:version-1'
  let entries = [{ name: 'first.txt', type: 1 }]
  let unavailable = false
  let statUnavailable = false
  let listingError = false
  let changeDuringRead = false
  let onRead: (() => Promise<void>) | undefined
  const execute = async (method: string, _uri: string): Promise<unknown> => {
    calls.push(method)
    if (method === 'FileSystem.getDirectoryVersion') {
      if (statUnavailable) throw new Error('unsupported')
      return version
    }
    if (listingError) throw new Error('permission denied')
    await onRead?.()
    if (changeDuringRead) version = 'connection-a:changed-during-read'
    return entries
  }
  const renderer = RendererWorker.registerMockRpc({
    'Application.execute': async (_id: string, method: string, _uri: string) => execute(method, uri),
    'FileSystem.getDirectoryVersion': async (uri: string) => execute('FileSystem.getDirectoryVersion', uri),
    'FileSystem.readDirWithFileTypes': async (uri: string) => execute('FileSystem.readDirWithFileTypes', uri),
  })
  const cache = CacheWorker.registerMockRpc({
    'Cache.getCacheStorageJsonItem': (key: string) => {
      if (unavailable) throw new Error('cache unavailable')
      const value = stored.get(key)
      return value ? { value: structuredClone(value) } : null
    },
    'Cache.removeCacheStorageItem': (key: string) => stored.delete(key),
    'Cache.setCacheStorageJsonItem': (key: string, value: unknown) => {
      if (unavailable) throw new Error('cache unavailable')
      stored.set(key, structuredClone(value))
      return { success: true }
    },
  })
  return {
    calls,
    set changeDuringRead(value: boolean) {
      changeDuringRead = value
    },
    set entries(value: { name: string; type: number }[]) {
      entries = value
    },
    get listingCount(): number {
      return calls.filter((call) => call === 'FileSystem.readDirWithFileTypes').length
    },
    set listingError(value: boolean) {
      listingError = value
    },
    set onRead(value: () => Promise<void>) {
      onRead = value
    },
    set statUnavailable(value: boolean) {
      statUnavailable = value
    },
    stored,
    [Symbol.dispose](): void {
      cache[Symbol.dispose]()
      renderer[Symbol.dispose]()
    },
    set unavailable(value: boolean) {
      unavailable = value
    },
    set version(value: string | null) {
      version = value
    },
  }
}

const uri = 'remote-ssh://host/workspace'

test('an unchanged listing uses a metadata check without a second listing transfer', async () => {
  using fixture = createFixture()
  const first = await readDirectory(uri)
  fixture.calls.length = 0
  expect(await readDirectory(uri)).toEqual(first)
  expect(fixture.calls).toEqual(['FileSystem.getDirectoryVersion'])
  const { value } = fixture.stored.values().next()
  expect(value.expires - Date.now()).toBeGreaterThan(89 * 24 * 60 * 60 * 1000)
  expect(value.expires - Date.now()).toBeLessThanOrEqual(90 * 24 * 60 * 60 * 1000)
})

test('a persisted entry is reusable without an in-memory listing', async () => {
  using fixture = createFixture()
  await readDirectory(uri)
  const snapshot = structuredClone([...fixture.stored])
  fixture.stored.clear()
  for (const [key, value] of snapshot) fixture.stored.set(key, value)
  await readDirectory(uri)
  expect(fixture.listingCount).toBe(1)
})

test.each(['connection-a:version-2', 'replacement-connection:version-1'])('a changed validator %s fetches current entries', async (version) => {
  using fixture = createFixture()
  await readDirectory(uri)
  fixture.version = version
  fixture.entries = [{ name: 'new.txt', type: 1 }]
  expect(await readDirectory(uri)).toEqual([{ name: 'new.txt', type: 1 }])
  expect(fixture.listingCount).toBe(2)
})

test.each([null, ''])('unsupported validator %s preserves fresh listing reads', async (version) => {
  using fixture = createFixture()
  fixture.version = version
  await readDirectory(uri)
  await readDirectory(uri)
  expect(fixture.listingCount).toBe(2)
  expect(fixture.stored.size).toBe(0)
})

test('unavailable metadata falls back to the filesystem', async () => {
  using fixture = createFixture()
  fixture.statUnavailable = true
  await readDirectory(uri)
  expect(fixture.listingCount).toBe(1)
})

test('cache failures preserve successful reads', async () => {
  using fixture = createFixture()
  fixture.unavailable = true
  await expect(readDirectory(uri)).resolves.toEqual([{ name: 'first.txt', type: 1 }])
})

test('filesystem errors remain visible even with a cached entry', async () => {
  using fixture = createFixture()
  await readDirectory(uri)
  fixture.statUnavailable = true
  fixture.listingError = true
  await expect(readDirectory(uri)).rejects.toThrow('permission denied')
})

test.each(['expired', 'malformed', 'future-expiry'])('%s entries are replaced', async (kind) => {
  using fixture = createFixture()
  await readDirectory(uri)
  const { value } = fixture.stored.values().next()
  switch (kind) {
    case 'expired': {
      value.expires = Date.now() - 1
      break
    }
    case 'future-expiry': {
      value.expires = Date.now() + 100 * 24 * 60 * 60 * 1000
      // No default
      break
    }
    case 'malformed': {
      value.dirents = [{ type: 1 }]
      break
    }
  }
  await readDirectory(uri)
  expect(fixture.listingCount).toBe(2)
})

test('URIs, authorities and applications have independent entries', async () => {
  using fixture = createFixture()
  for (const location of [uri, 'remote-ssh://other/workspace', `${uri}/nested`]) {
    for (const application of [undefined, 'app-a', 'app-b']) {
      await readDirectory(location, application)
      await readDirectory(location, application)
    }
  }
  expect(fixture.listingCount).toBe(9)
  expect(fixture.stored.size).toBe(9)
})

test('refresh replaces a listing even if the validator has not changed', async () => {
  using fixture = createFixture()
  await readDirectory(uri)
  fixture.entries = [{ name: 'fresh.txt', type: 1 }]
  expect(await readDirectory(uri, undefined, true)).toEqual([{ name: 'fresh.txt', type: 1 }])
  expect(await readDirectory(uri)).toEqual([{ name: 'fresh.txt', type: 1 }])
  expect(fixture.listingCount).toBe(2)
})

test('parent invalidation removes the persisted listing after mutations', async () => {
  using fixture = createFixture()
  await readDirectory(`${uri}/`)
  await invalidateParent(`${uri}/created.txt`)
  expect(fixture.stored.size).toBe(0)
  await readDirectory(uri)
  expect(fixture.listingCount).toBe(2)
})

test('a directory change during a listing is not persisted', async () => {
  using fixture = createFixture()
  fixture.changeDuringRead = true
  await readDirectory(uri)
  expect(fixture.stored.size).toBe(0)
})

test('refresh waits for an older listing write and cannot be overwritten by it', async () => {
  using fixture = createFixture()
  const reading = Promise.withResolvers<void>()
  const blocked = Promise.withResolvers<void>()
  fixture.onRead = async (): Promise<void> => {
    reading.resolve()
    await blocked.promise
  }
  const first = readDirectory(uri)
  await reading.promise
  const refresh = readDirectory(uri, undefined, true)
  blocked.resolve()
  await Promise.all([first, refresh])
  expect(fixture.listingCount).toBe(2)
  expect(fixture.stored.size).toBe(1)
})
