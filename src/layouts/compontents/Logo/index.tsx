import React from 'react'
import logo from '@/assets/logo.png'
import intl from "react-intl-universal";
import styles from './index.less'

export default () => {
  return (
    <div className={styles.logoWrap}>
      <div className={styles.imgWrap}>
        <img src={logo} alt="logo" />
      </div>
      <span>{intl.get('header.logo')}</span>
    </div>
  )
}
