import * as CompareDirent from '../CompareDirent/CompareDirent.ts'

export const sortExplorerItems = (rawDirents: any): void => {
  rawDirents.sort(CompareDirent.compareDirent)
}
