export type ExcludesRecord = Readonly<Record<string, boolean>>

export const defaultExcludes: ExcludesRecord = {
  '**/.DS_Store': true,
  '**/.git': true,
  '**/.hg': true,
  '**/.svn': true,
  '**/Thumbs.db': true,
}

export const setExcludes = async (
  Settings: { update(settings: Readonly<Record<string, unknown>>): Promise<void> },
  excludesRecord: ExcludesRecord,
): Promise<void> => {
  await Settings.update({
    'files.exclude': excludesRecord,
  })
}
