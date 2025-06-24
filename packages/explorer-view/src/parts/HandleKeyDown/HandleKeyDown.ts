import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { cancelTypeAhead } from '../CancelTypeAhead/CancelTypeAhead.ts'
import { filterByFocusWord } from '../FilterByFocusWord/FilterByFocusWord.ts'
import { isAscii } from '../IsAscii/IsAscii.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

let timeout: number | undefined

export const handleKeyDown = (state: ExplorerState, key: string): ExplorerState => {
  const { focusWord, items, focusedIndex, focusWordTimeout } = state
  if (focusWord && key === '') {
    return cancelTypeAhead(state)
  }
  if (!isAscii(key)) {
    return state
  }

  const newFocusWord = focusWord + key.toLowerCase()
  const itemNames = items.map((item) => item.name)
  const matchingIndex = filterByFocusWord(itemNames, focusedIndex, newFocusWord)

  if (timeout) {
    clearTimeout(timeout)
  }

  // @ts-ignore

  timeout = setTimeout(async () => {
    await RendererWorker.invoke('Explorer.cancelTypeAhead')
  }, focusWordTimeout)

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
