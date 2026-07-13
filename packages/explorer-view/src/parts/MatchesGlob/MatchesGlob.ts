const dotSlashRegex = /^\.\//
const leadingSlashRegex = /^\//
const regexCharacterRegex = /[\\^$.*+?()[\]{}|]/
const trailingSlashRegex = /\/$/

const escapeRegexCharacter = (character: string): string => {
  return regexCharacterRegex.test(character) ? `\\${character}` : character
}

const globToRegexSource = (glob: string): string => {
  let source = ''
  for (let i = 0; i < glob.length; i++) {
    const character = glob[i]
    if (character === '*') {
      if (glob[i + 1] === '*') {
        i++
        if (glob[i + 1] === '/') {
          i++
          source += '(?:.*/)?'
        } else {
          source += '.*'
        }
      } else {
        source += '[^/]*'
      }
      continue
    }
    if (character === '?') {
      source += '[^/]'
      continue
    }
    source += escapeRegexCharacter(character)
  }
  return source
}

const regexCache = new Map<string, RegExp>()

const getRegex = (glob: string): RegExp => {
  const cached = regexCache.get(glob)
  if (cached) {
    return cached
  }
  const regex = new RegExp(`^${globToRegexSource(glob)}$`)
  regexCache.set(glob, regex)
  return regex
}

export const matchesGlob = (glob: string, relativePath: string): boolean => {
  const normalizedGlob = glob.replaceAll('\\', '/').replace(dotSlashRegex, '').replace(leadingSlashRegex, '').replace(trailingSlashRegex, '')
  if (!normalizedGlob) {
    return false
  }
  const normalizedPath = relativePath.replaceAll('\\', '/').replace(dotSlashRegex, '').replace(leadingSlashRegex, '').replace(trailingSlashRegex, '')
  const candidate = normalizedGlob.includes('/') ? normalizedPath : normalizedPath.slice(normalizedPath.lastIndexOf('/') + 1)
  const regex = getRegex(normalizedGlob)
  return regex.test(candidate)
}
