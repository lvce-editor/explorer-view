import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { cancelTypeAhead } from '../CancelTypeAhead/CancelTypeAhead.ts'
import { filterByFocusWord } from '../FilterByFocusWord/FilterByFocusWord.ts'
import { isAscii } from '../IsAscii/IsAscii.ts'

const typeAheadTimeouts = new Map<number, ReturnType<typeof setTimeout>>()

export const handleKeyDown = (state: ExplorerState, defaultPrevented: boolean, key: string): ExplorerState => {
  const { applicationId, uid } = state
  const { focusedIndex, focusWord, focusWordTimeout, items } = state
  if (defaultPrevented) {
    return state
  }
  if (focusWord && key === '') {
    return cancelTypeAhead(state)
  }
  if (!isAscii(key)) {
    return state
  }

  const newFocusWord = focusWord + key.toLowerCase()
  const itemNames = items.map((item) => item.name)
  const matchingIndex = filterByFocusWord(itemNames, focusedIndex, newFocusWord)

  const previous = typeAheadTimeouts.get(uid)
  if (previous) {
    clearTimeout(previous)
  }

  const timer = setTimeout(() => {
    typeAheadTimeouts.delete(uid)
    void ApplicationRpc.invokeForView(applicationId, uid, 'Explorer.cancelTypeAhead').catch(() => {})
  }, focusWordTimeout)
  typeAheadTimeouts.set(uid, timer)

  if (matchingIndex === -1) {
    return {
      ...state,
      focusWord: newFocusWord,
    }
  }

  return {
    ...state,
    focusedIndex: matchingIndex,
    focusWord: newFocusWord,
  }
}
