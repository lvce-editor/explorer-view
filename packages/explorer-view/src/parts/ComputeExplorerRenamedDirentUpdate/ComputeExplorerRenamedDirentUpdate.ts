import type { TreeUpdate } from '../TreeUpdate/TreeUpdate.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'

export const computeExplorerRenamedDirentUpdate = async (root: string, parentPath: string, parentDepth: number): Promise<TreeUpdate> => {
  const children = await getChildDirents('/', parentPath, parentDepth, [])
  const relativeDirname = parentPath.slice(root.length)
  return {
    [relativeDirname]: children,
  }
}
