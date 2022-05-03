import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon'

interface Props {
  extension?: string;
}

const Icon: React.FC<Props> = ({ extension = '' as DefaultExtensionType }) =>
  <FileIcon extension={extension as DefaultExtensionType} {...defaultStyles[extension as DefaultExtensionType]} />

export default Icon
