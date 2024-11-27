import { expect, test } from '@jest/globals'
import * as ExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'

test('newFile', () => {
  expect(typeof ExplorerStrings.newFile()).toBe('string')
})

test('newFolder', () => {
  expect(typeof ExplorerStrings.newFolder()).toBe('string')
})

test('openContainingFolder', () => {
  expect(typeof ExplorerStrings.openContainingFolder()).toBe('string')
})

test('openInIntegratedTerminal', () => {
  expect(typeof ExplorerStrings.openInIntegratedTerminal()).toBe('string')
})

test('cut', () => {
  expect(typeof ExplorerStrings.cut()).toBe('string')
})

test('copy', () => {
  expect(typeof ExplorerStrings.copy()).toBe('string')
})

test('paste', () => {
  expect(typeof ExplorerStrings.paste()).toBe('string')
})

test('copyPath', () => {
  expect(typeof ExplorerStrings.copyPath()).toBe('string')
})

test('copyRelativePath', () => {
  expect(typeof ExplorerStrings.copyRelativePath()).toBe('string')
})

test('rename', () => {
  expect(typeof ExplorerStrings.rename()).toBe('string')
})

test('deleteItem', () => {
  expect(typeof ExplorerStrings.deleteItem()).toBe('string')
})

test('refresh', () => {
  expect(typeof ExplorerStrings.refresh()).toBe('string')
})

test('collapseAll', () => {
  expect(typeof ExplorerStrings.collapseAll()).toBe('string')
})

test('explorer', () => {
  expect(typeof ExplorerStrings.explorer()).toBe('string')
})

test('filesExplorer', () => {
  expect(typeof ExplorerStrings.filesExplorer()).toBe('string')
})

test('youHaveNotYetOpenedAFolder', () => {
  expect(typeof ExplorerStrings.youHaveNotYetOpenedAFolder()).toBe('string')
})

test('openFolder', () => {
  expect(typeof ExplorerStrings.openFolder()).toBe('string')
})

test('noFolderOpen', () => {
  expect(typeof ExplorerStrings.noFolderOpen()).toBe('string')
})
