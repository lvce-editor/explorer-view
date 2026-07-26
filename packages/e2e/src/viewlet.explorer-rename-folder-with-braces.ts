import { renameFolderNameTest } from './_name-test.ts'

export const name = 'viewlet.explorer-rename-folder-with-braces'

export const test = renameFolderNameTest('config.{env}')
