import * as DiffEditingIndex from '../DiffEditingIndex/DiffEditingIndex.ts'
import * as DiffFocus from '../DiffFocus/DiffFocus.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'

export const modules = [DiffItems.isEqual, DiffEditingIndex.isEqual, DiffFocus.isEqual]

export const numbers = [DiffItems.diffType, DiffEditingIndex.diffType, DiffFocus.diffType]
