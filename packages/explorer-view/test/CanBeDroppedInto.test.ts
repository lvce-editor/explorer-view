import { expect, test } from '@jest/globals'
import * as CanBeDroppedInto from '../src/parts/CanBeDroppedInto/CanBeDroppedInto.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('canBeDroppedInto - undefined', () => {
  expect(CanBeDroppedInto.canBeDroppedInto(undefined)).toBe(false)
})

test('canBeDroppedInto - null', () => {
  expect(CanBeDroppedInto.canBeDroppedInto(null)).toBe(false)
})

test('canBeDroppedInto - directory', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: DirentType.Directory,
    }),
  ).toBe(true)
})

test('canBeDroppedInto - directory expanded', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: DirentType.DirectoryExpanded,
    }),
  ).toBe(true)
})

test('canBeDroppedInto - directory expanding', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: DirentType.DirectoryExpanding,
    }),
  ).toBe(true)
})

test('canBeDroppedInto - file', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: DirentType.File,
    }),
  ).toBe(false)
})

test('canBeDroppedInto - unknown type', () => {
  expect(
    CanBeDroppedInto.canBeDroppedInto({
      type: 999999,
    }),
  ).toBe(false)
})
