import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { isAscii } from '../IsAscii/IsAscii.ts'
import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

let timeout: number | undefined

export const handleKeyDown = (state: ExplorerState, key: string): ExplorerState => {
  if (key === '') {
    if (state.focusWord) {
      return {
        ...state,
        focusWord: '',
      }
    }
    return state
  }
  if (!isAscii(key)) {
    return state
  }

  const newFocusWord = state.focusWord + key.toLowerCase()
  const matchingIndex = state.items.findIndex((item) => item.name.toLowerCase().startsWith(newFocusWord))

  if (timeout) {
    clearTimeout(timeout)
  }

  // @ts-ignore
  // eslint-disable-next-line  @typescript-eslint/no-misused-promises
  timeout = setTimeout(async () => {
    await ParentRpc.invoke('Explorer.handleKeyDown', '')
  }, state.focusWordTimeout)

  if (matchingIndex === -1) {
    return {
      ...state,
      focusWord: newFocusWord,
    }
  }

  return {
    ...state,
    focusWord: newFocusWord,
    focusedIndex: matchingIndex,
  }
}
