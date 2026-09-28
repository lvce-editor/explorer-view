import { expect, jest, test } from '@jest/globals'

test('creates the numeric collator only when needed and reuses it', async () => {
  using collator = jest.spyOn(Intl, 'Collator')

  await jest.isolateModulesAsync(async () => {
    const { compareStringNumeric } = await import('../src/parts/Compare/Compare.ts')
    expect(collator).not.toHaveBeenCalled()

    expect(compareStringNumeric('same', 'same')).toBe(0)
    expect(compareStringNumeric('a', 'b')).toBeLessThan(0)
    expect(compareStringNumeric('2', '10')).toBeLessThan(0)
    expect(collator).not.toHaveBeenCalled()

    expect(compareStringNumeric('file2.txt', 'file10.txt')).toBeLessThan(0)
    expect(collator).toHaveBeenCalledTimes(1)
    expect(collator).toHaveBeenCalledWith('en', { numeric: true })

    expect(compareStringNumeric('file10.txt', 'file2.txt')).toBeGreaterThan(0)
    expect(collator).toHaveBeenCalledTimes(1)
  })
})
