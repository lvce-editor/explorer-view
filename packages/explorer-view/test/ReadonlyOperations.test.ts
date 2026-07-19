import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { acceptEdit } from '../src/parts/AcceptEdit/AcceptEdit.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleCut } from '../src/parts/HandleCut/HandleCut.ts'
import { handleDragOver } from '../src/parts/HandleDragOver/HandleDragOver.ts'
import { handleDrop } from '../src/parts/HandleDrop/HandleDrop.ts'
import { handleDropIndex } from '../src/parts/HandleDropIndex/HandleDropIndex.ts'
import { handlePaste } from '../src/parts/HandlePaste/HandlePaste.ts'
import { handleUpload } from '../src/parts/HandleUpload/HandleUpload.ts'
import { newFile } from '../src/parts/NewFile/NewFile.ts'
import { newFolder } from '../src/parts/NewFolder/NewFolder.ts'
import { removeDirent } from '../src/parts/RemoveDirent/RemoveDirent.ts'
import { renameDirent } from '../src/parts/RenameDirent/RenameDirent.ts'

const state: ExplorerState = {
  ...createDefaultState(),
  isReadonly: true,
}

test.each([
  ['accept edit', (): Promise<ExplorerState> => acceptEdit(state)],
  ['create file', (): Promise<ExplorerState> => newFile(state)],
  ['create folder', (): Promise<ExplorerState> => newFolder(state)],
  ['cut', (): Promise<ExplorerState> => handleCut(state)],
  ['delete', (): Promise<ExplorerState> => removeDirent(state)],
  ['drop', (): Promise<ExplorerState> => handleDrop(state, 0, 0, [], undefined as any)],
  ['drop at index', (): Promise<ExplorerState> => handleDropIndex(state, [], [], [], 0)],
  ['paste', (): Promise<ExplorerState> => handlePaste(state)],
  ['rename', (): Promise<ExplorerState> => renameDirent(state)],
  ['upload', (): Promise<ExplorerState> => handleUpload(state, [])],
])('readonly explorer ignores %s', async (name, operation) => {
  expect(await operation()).toBe(state)
})

test('readonly explorer does not show drop targets', () => {
  expect(handleDragOver(state, 0, 0)).toBe(state)
})
