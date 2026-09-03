import { createRequire } from 'node:module'

const serverRequire = createRequire(new URL('../../server/package.json', import.meta.url))

export const resolveServerPath = (): string => {
  return serverRequire.resolve('@lvce-editor/server/bin/server.js')
}
