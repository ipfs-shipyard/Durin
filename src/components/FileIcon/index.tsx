import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon'
import { FC } from 'react'

interface Props {
  extension?: string;
}

const Icon: FC<Props> = ({ extension = '' as DefaultExtensionType }) =>
  <FileIcon extension={extension as DefaultExtensionType} {...defaultStyles[extension as DefaultExtensionType]} />

export default Icon
