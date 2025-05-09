import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'

test('render2 - basic', () => {
  const uid = 1
  const diffResult = [DiffType.RenderItems, DiffType.RenderFocus]
  const oldState = createDefaultState()
  const newState = { ...oldState }
  ExplorerStates.set(uid, oldState, newState)
  const result = Render2.render2(uid, diffResult)
  expect(result).toEqual([
    [
      'Viewlet.setDom2',
      [
        {
          childCount: 2,
          className: 'Viewlet Explorer',
          role: 'none',
          type: 4,
        },
        {
          ariaActiveDescendant: 'TreeItemActive',
          ariaLabel: 'Files Explorer',
          childCount: 0,
          className: 'ListItems',
          onBlur: 'handleListBlur',
          onClick: 'handleClick',
          onContextMenu: 'handleContextMenu',
          onDragLeave: 'handleDragLeave',
          onDragOver: 'handleDragOver',
          onDrop: 'handleDrop',
          onFocus: 'handleListFocus',
          onPointerDown: 'handlePointerDown',
          onWheel: 'handleWheel',
          onKeyDown: 'handleListKeyDown',
          role: 'tree',
          tabIndex: 0,
          type: 4,
        },
      ],
    ],
  ])
})
