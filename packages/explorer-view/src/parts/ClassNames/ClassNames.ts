export const Actions = 'Actions'
export const Button = 'Button'
export const ButtonNarrow = 'ButtonNarrow'
export const ButtonPrimary = 'ButtonPrimary'
export const ButtonWide = 'ButtonWide'
export const Chevron = 'Chevron'
export const Explorer = 'Explorer'
export const Empty = ''
export const ExplorerDropTarget = 'DropTarget'
export const FileIcon = 'FileIcon'
export const FocusOutline = 'FocusOutline'
export const IconButton = 'IconButton'
export const InputBox = 'InputBox'
export const Label = 'Label'
export const MaskIconChevronDown = 'MaskIconChevronDown'
export const MaskIconChevronRight = 'MaskIconChevronRight'
export const TreeItem = 'TreeItem'
export const TreeItemActive = 'TreeItemActive'
export const Viewlet = 'Viewlet'
export const Welcome = 'Welcome'
export const WelcomeMessage = 'WelcomeMessage'

// TODO add option to make classnames numeric
// once at start, send all classnames to renderer process
// then, components uses numeric classname
// when a component uses multiple classnames, it is a new number
// representing the concatenated strings for example
// 0 = 'Button'
// 1 = 'IconButton'
// 2 = 'Button IconButton'
// it could make dom diffing faster, since for classname,
// only numbers are compared. it could also make rendering faster,
// since less data is transferred to renderer process
