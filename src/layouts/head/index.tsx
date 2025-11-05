import React from 'react'
import styles from './index.less'
import Logo from '../compontents/Logo'
import Routes from '../compontents/Routes'
import ThemeBtn from '../compontents/ThemeBtn'

export default () => {
  return (
    <div className={styles.headerWrapper}>
      <Logo />
      <Routes />
      <ThemeBtn />
    </div>
  )
}
