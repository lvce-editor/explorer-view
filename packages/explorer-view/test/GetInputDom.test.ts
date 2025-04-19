import { expect, test } from '@jest/globals'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getInputDom } from '../src/parts/GetInputDom/GetInputDom.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getInputDom - without error', () => {
  const result = getInputDom(false)
  expect(result).toEqual([
    {
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      id: 'ExplorerInput',
      onInput: 'handleEditingInput',
      childCount: 0,
      name: InputName.ExplorerInput,
    },
  ])
})

test('getInputDom - with error', () => {
  const result = getInputDom(true)
  expect(result).toEqual([
    {
      type: VirtualDomElements.Input,
      className: expect.stringContaining(ClassNames.InputBox),
      id: 'ExplorerInput',
      onInput: 'handleEditingInput',
      childCount: 0,
      name: InputName.ExplorerInput,
    },
  ])
})
