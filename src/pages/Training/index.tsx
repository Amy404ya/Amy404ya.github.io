import React from 'react'
import MusicPlayerCard from '@/layouts/compontents/MusicPlayerCard'
import styles from './index.less'
import MusicAudio from '../Home/MusicAudio'
import EffectSwiper from '@/compontents/EffectSwiper'

export default () => {
  return (
    <div className={styles.training}>
      训练场
      <EffectSwiper />
      <MusicAudio />
      <MusicPlayerCard />
    </div>
  )
}
