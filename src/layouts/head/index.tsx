import React from 'react'
import styles from './index.less'
import Logo from '../compontents/Logo'
import Routes from '../compontents/Routes'
import ThemeBtn from '../compontents/ThemeBtn'
import Language from '../compontents/Language'
import DailyQuote from '../compontents/DailyQuote'

type HeadProps = {
  showDailyQuote: boolean
}

// interface HeadProps1 {
//   showDailyQuote: boolean
// }

export default ({ showDailyQuote }: HeadProps) => {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.topWrap}>
        <Logo />
        <Routes />
        <ThemeBtn />
        <Language />
      </div>
      {showDailyQuote ? <DailyQuote /> : null}
    </div>
  )
}
