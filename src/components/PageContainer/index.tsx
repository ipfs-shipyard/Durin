import './index.css'

interface ContainerProps {
  title?: string;
  text?: string;
}

const PageContainer: React.FC<ContainerProps> = ({ title, text, children }) => {
  return (
    <div className="page-container-component">
      {title && <strong>{title}</strong>}
      {text && <p>{text}</p>}
      {children}
    </div>
  )
}

export default PageContainer
