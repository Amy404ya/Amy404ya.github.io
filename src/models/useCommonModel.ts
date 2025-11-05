
import React, { useState } from 'react'

const useCommonModel = () => {
  const [theme, setTheme] = useState('light')
  
  return {
    theme,
    setTheme,
  }
}

export default useCommonModel