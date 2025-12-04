import React, { useState, useRef } from 'react'
import styles from './index.less'
import MusicAudio from './MusicAudio'

export default () => {

  return (
    <div
      className={styles.homeWrap}
      style={{background:'rgba(0,0,0,0.8)'}}>
      开启<i className='iconfont'>&#xe78a;</i>
      <div className={styles.ces}>
        <MusicAudio />
      </div>
    </div>
  )
}
