import * as DiffFocus from '../DiffFocus/DiffFocus.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as DiffValue from '../DiffValue/DiffValue.ts'

export const modules = [DiffItems.isEqual, DiffFocus.isEqual, DiffFocus.isEqual, DiffValue.isEqual]

export const numbers = [DiffItems.diffType, DiffFocus.diffType, DiffType.RenderFocusContext, DiffValue.diffType]
