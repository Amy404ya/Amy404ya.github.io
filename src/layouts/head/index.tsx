import React from 'react'
import styles from './index.less'
import Logo from '../compontents/Logo'
import Routes from '../compontents/Routes'
import ThemeBtn from '../compontents/ThemeBtn'
import Language from '../compontents/Language'
import DailyQuote from '../compontents/DailyQuote'

export default () => {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.topWrap}>
        <Logo />
        <Routes />
        <ThemeBtn />
        <Language />
      </div>
      <DailyQuote />
    </div>
  )
}
