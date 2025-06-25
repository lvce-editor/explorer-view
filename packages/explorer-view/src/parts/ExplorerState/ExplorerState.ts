import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'

export interface ExplorerState {
  readonly uid: number
  readonly parentUid: number
  readonly root: string
  readonly items: readonly ExplorerItem[]
  readonly focusedIndex: number
  readonly focused: boolean
  readonly hoverIndex: number
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly deltaY: number
  readonly minLineY: number
  readonly maxLineY: number
  readonly pathSeparator: string
  readonly version: number
  readonly editingIndex: number
  readonly itemHeight: number
  readonly dropTargets: readonly number[]
  readonly excluded: readonly any[]
  readonly editingValue: string
  readonly editingType: number
  readonly editingIcon: string
  readonly editingErrorMessage: string
  readonly editingSelectionStart: number
  readonly editingSelectionEnd: number
  readonly icons: readonly string[]
  readonly useChevrons: boolean
  readonly confirmDelete: boolean
  readonly confirmPaste: boolean
  readonly fileIconCache: FileIconCache
  readonly platform: number
  readonly focus: number
  readonly inputSource: number
  readonly focusWord: string
  readonly focusWordTimeout: number
  readonly finalDeltaY: number
  readonly scrollBarHeight: number
  readonly handleOffset: number
  readonly scrollBarActive: boolean
}
