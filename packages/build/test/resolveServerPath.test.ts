import { access } from 'node:fs/promises'
import { test } from 'node:test'
import { resolveServerPath } from '../src/resolveServerPath.ts'

test('resolves the server executable from the server workspace', async () => {
  await access(resolveServerPath())
})
