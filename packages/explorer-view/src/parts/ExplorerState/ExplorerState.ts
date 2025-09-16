import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'

export interface ExplorerState {
  readonly visibleExplorerItems: readonly VisibleExplorerItem[]
  readonly confirmDelete: boolean
  readonly confirmPaste: boolean
  readonly cutItems: readonly string[]
  readonly deltaY: number
  readonly dropTargets: readonly number[]
  readonly editingErrorMessage: string
  readonly editingIcon: string
  readonly editingIndex: number
  readonly editingSelectionEnd: number
  readonly editingSelectionStart: number
  readonly editingType: number
  readonly editingValue: string
  readonly errorMessageLeft: number
  readonly errorMessageTop: number
  readonly excluded: readonly any[]
  readonly fileIconCache: FileIconCache
  readonly finalDeltaY: number
  readonly focus: number
  readonly focused: boolean
  readonly focusedIndex: number
  readonly focusWord: string
  readonly focusWordTimeout: number
  readonly handleOffset: number
  readonly height: number
  readonly hoverIndex: number
  readonly icons: readonly string[]
  readonly inputSource: number
  readonly isPointerDown: boolean
  readonly itemHeight: number
  readonly items: readonly ExplorerItem[]
  readonly maxIndent: number
  readonly maxLineY: number
  readonly minLineY: number
  readonly parentUid: number
  readonly pasteShouldMove: boolean
  readonly pathSeparator: string
  readonly platform: number
  readonly pointerDownIndex: number
  readonly root: string
  readonly scrollBarActive: boolean
  readonly scrollBarHeight: number
  readonly sourceControlIgnoredUris: readonly string[]
  readonly uid: number
  readonly useChevrons: boolean
  readonly version: number
  readonly width: number
  readonly x: number
  readonly y: number
}
