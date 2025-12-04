import React from 'react'
import styles from './index.less'

export default ({cover, title, artist}: {cover: string, title: string, artist: string}) => {
  return (
    <div className={styles.musicCard}>
      <img className={styles.cover} src={cover} alt={title} />
      <div className={styles.musicCardContent}>
        <div className={styles.dailyPush}>每日推送</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.artist}>{artist}</div>
      </div>
    </div>
  )
}