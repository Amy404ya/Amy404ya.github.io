import React, { useState } from 'react'
import sunTheme from '@/assets/sunTheme.png'
import nightTheme from '@/assets/nightTheme.png'
import { useModel } from 'umi'
import styles from './index.less'

export default () => {
  const {theme,setTheme} = useModel('useCommonModel')
  
  return (
    <div className={styles.themeBtn} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <img src={theme === 'light' ? nightTheme : sunTheme} alt="themeBtn" />
    </div>
  )
}
