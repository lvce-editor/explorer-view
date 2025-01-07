import { expect, test } from '@jest/globals'
import * as CanBeDroppedInto from '../src/parts/CanBeDroppedInto/CanBeDroppedInto.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('canBeDroppedInto - directory', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: DirentType.Directory,
    } as any),
  ).toBe(true)
})

test('canBeDroppedInto - directory expanded', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: DirentType.DirectoryExpanded,
    } as any),
  ).toBe(true)
})

test('canBeDroppedInto - directory expanding', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: DirentType.DirectoryExpanding,
    } as any),
  ).toBe(true)
})

test('canBeDroppedInto - file', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: DirentType.File,
    } as any),
  ).toBe(false)
})

test('canBeDroppedInto - unknown type', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: 999999,
    } as any),
  ).toBe(false)
})
