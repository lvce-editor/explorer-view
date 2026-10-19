export const filterByFocusWord = (items: readonly string[], focusedIndex: number, focusWord: string): number => {
  if (items.length === 0) {
    return -1
  }

  const matches: number[] = []
  for (const [i, item] of items.entries()) {
    if (item.toLowerCase().startsWith(focusWord)) {
      matches.push(i)
    }
  }

  if (matches.length === 0) {
    return -1
  }

  // Find the next match after the current focus
  let nextIndex = matches.findIndex((index) => index > focusedIndex)
  if (nextIndex === -1) {
    // If no match found after current focus, wrap around to the first match
    nextIndex = 0
  }

  return matches[nextIndex]
}
