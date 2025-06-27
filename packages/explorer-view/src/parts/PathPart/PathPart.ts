export interface PathPart {
  readonly depth: number
  readonly expande?: boolean
  readonly path: string
  readonly pathSeparator: string
  readonly root: string
}
