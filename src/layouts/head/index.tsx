import React from 'react'
import styles from './index.less'
import Logo from '../compontents/Logo'
import Routes from '../compontents/Routes'
import ThemeBtn from '../compontents/ThemeBtn'
import Language from '../compontents/Language'

export default () => {
  return (
    <div className={styles.headerWrapper}>
      <Logo />
      <Routes />
      <ThemeBtn />
      <Language />
    </div>
  )
}
