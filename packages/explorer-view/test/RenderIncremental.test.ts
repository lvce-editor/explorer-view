import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

test('renderIncremental - returns patches for changed items', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    items: [{ depth: 1, name: 'test.txt', posInSet: 1, selected: false, setSize: 1, type: DirentType.File, uri: '/workspace/test.txt' }],
    uid: 123,
  }
  const result = renderIncremental(oldState, newState)
  expect(result[0]).toBe('Viewlet.setTreePatches')
  expect(result[1]).toBe(123)
  expect(result[2]).toEqual(expect.any(Array))
})

test('renderIncremental - uses tree patches when a scrollbar is the only added child', () => {
  const oldState = {
    ...createDefaultState(),
    height: 506,
    itemHeight: 22,
    items: Array.from({ length: 23 }, (_, index) => ({
      depth: 1,
      name: `file-${index}`,
      selected: false,
      type: DirentType.File,
      uri: `/workspace/file-${index}`,
    })),
    root: '/workspace',
    uid: 123,
  }
  const result = renderIncremental(oldState, { ...oldState, height: 505 })
  expect(result[0]).toBe('Viewlet.setTreePatches')
  expect(result[2]).toEqual([{ nodes: expect.arrayContaining([expect.objectContaining({ className: 'ScrollBar ScrollBarSmall' })]), type: 6 }])
})

test('renderIncremental - initializes an empty workspace with a full root render', () => {
  const oldState = { ...createDefaultState(), initial: true }
  const newState = { ...oldState, initial: false, root: '/workspace', uid: 123 }
  const result = renderIncremental(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[2][0]).toEqual(expect.objectContaining({ className: 'Viewlet Explorer' }))
})
