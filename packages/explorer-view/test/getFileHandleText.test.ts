import { test, expect, jest } from '@jest/globals'
import { getFileHandleText } from '../src/parts/GetFileHandleText/GetFileHandleText.js'

test('getFileHandleText returns file content as text', async () => {
  const mockFileHandle = {
    getFile: jest.fn<() => Promise<{ text: () => Promise<string> }>>().mockResolvedValue({
      text: jest.fn<() => Promise<string>>().mockResolvedValue('test content'),
    }),
  } as unknown as FileSystemFileHandle

  const result = await getFileHandleText(mockFileHandle)
  expect(result).toBe('test content')
  expect(mockFileHandle.getFile).toHaveBeenCalled()
})
