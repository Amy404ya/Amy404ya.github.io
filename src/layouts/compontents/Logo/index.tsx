import React from 'react'
import logo from '@/assets/logo.png'
import styles from './index.less'

export default () => {
  return (
    <div className={styles.logoWrap}>
      <div className={styles.imgWrap}>
        <img src={logo} alt="logo" />
      </div>
      <span>Amy's SecretHut</span>
    </div>
  )
}
