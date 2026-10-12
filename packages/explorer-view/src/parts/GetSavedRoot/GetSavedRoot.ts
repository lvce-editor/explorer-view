export const getSavedRoot = (savedState: any, workspaceUri: string | undefined): string => {
  return workspaceUri ?? ''
}
