import * as DiffDragData from '../DiffDragData/DiffDragData.ts'
import * as DiffFocus from '../DiffFocus/DiffFocus.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'
import * as DiffSelection from '../DiffSelection/DiffSelection.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as DiffValue from '../DiffValue/DiffValue.ts'

export const modules = [DiffItems.isEqual, DiffFocus.isEqual, DiffFocus.isEqual, DiffValue.isEqual, DiffSelection.isEqual, DiffDragData.isEqual]

export const numbers = [
  DiffItems.diffType,
  DiffFocus.diffType,
  DiffType.RenderFocusContext,
  DiffValue.diffType,
  DiffSelection.diffType,
  DiffDragData.diffType,
]
