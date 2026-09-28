import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWorkspaceProgress } from '../src/parts/HandleWorkspaceProgress/HandleWorkspaceProgress.ts'

test('sets and clears the workspace progress message', () => {
  const state = createDefaultState()
  const progressState = handleWorkspaceProgress(state, 'Opening Remote Workspace…')

  expect(progressState.workspaceProgressMessage).toBe('Opening Remote Workspace…')
  expect(handleWorkspaceProgress(progressState, '').workspaceProgressMessage).toBe('')
})

test('returns the same state when the workspace progress message is unchanged', () => {
  const state = createDefaultState()

  expect(handleWorkspaceProgress(state, '')).toBe(state)
})
