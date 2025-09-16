import { expect, test } from '@jest/globals'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getInputDom } from '../src/parts/GetInputDom/GetInputDom.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getInputDom - without error', () => {
  const result = getInputDom(true, false)
  expect(result).toEqual([
    {
      type: VirtualDomElements.Input,
      className: `ExplorerInputBox`,
      id: 'ExplorerInput',
      onInput: DomEventListenerFunctions.HandleEditingInput,
      onBlur: DomEventListenerFunctions.HandleInputBlur,
      childCount: 0,
      name: InputName.ExplorerInput,
      ariaLabel: 'Type file name. Press Enter to confirm or Escape to cancel.',
      autocapitalize: 'off',
      autocorrect: 'off',
      spellcheck: 'false',
      onClick: DomEventListenerFunctions.HandleInputClick,
    },
  ])
})

test('getInputDom - with error', () => {
  const result = getInputDom(true, true)
  expect(result).toEqual([
    {
      type: VirtualDomElements.Input,
      className: expect.stringContaining(ClassNames.InputBox),
      id: 'ExplorerInput',
      onInput: DomEventListenerFunctions.HandleEditingInput,
      onBlur: DomEventListenerFunctions.HandleInputBlur,
      childCount: 0,
      name: InputName.ExplorerInput,
      ariaLabel: 'Type file name. Press Enter to confirm or Escape to cancel.',
      autocapitalize: 'off',
      autocorrect: 'off',
      spellcheck: 'false',
      onClick: DomEventListenerFunctions.HandleInputClick,
    },
  ])
})
