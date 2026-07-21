import React from 'react'
import HeaderComponent from './HeaderComponent'

const PageLayoutComponent = ({ children, headerStyle }) => {
  return (
     <>
      <HeaderComponent style={headerStyle} />
      {children}
    </>
  )
}

export default PageLayoutComponent