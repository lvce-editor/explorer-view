import { fileURLToPath } from 'node:url'

export const resolveServerPath = (): string => {
  return fileURLToPath(new URL('../../server/src/server.js', import.meta.url))
}
