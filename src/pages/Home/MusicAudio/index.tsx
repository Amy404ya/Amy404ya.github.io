import React, { useState, useRef, useEffect } from 'react'
import styles from './index.less'
import EffectSwiper from '@/compontents/EffectSwiper'
import tracks from './tracks'
import MusicCard from './compontents/MusicCard'
import MusicPlay from './compontents/MusicPlay'

export default ()=> {
  // 当前选中的曲目 id（用于轮播和音频播放同步）
  const [currentTrackId, setCurrentTrackId] = useState<string>(tracks[0]?.id || '')

  // 创建轮播项列表
  const swiperList = () => {
    const {id, cover, title, artist} = tracks[0]
    return (
    <MusicCard
      cover={cover}
      title={title}
      artist={artist}
    />
  )}

  /**
   * 音乐播放完成时的回调
   * 自动切换到下一首（轮播会跟随切换）
   */
  const handleTrackEnd = () => {
    // 根据当前 id 找到索引并切换到下一首（循环）
    const currentIndex = tracks.findIndex(t => t.id === currentTrackId)
    const nextIndex = (currentIndex + 1) % tracks.length
    const nextId = tracks[nextIndex]?.id
    if (nextId) setCurrentTrackId(nextId)
  }


  return (
    <div
      className={styles.homeWrap}>
          {swiperList()}
      <MusicPlay
        currentTrackId={currentTrackId}
        onTrackEnd={handleTrackEnd}
      />
    </div>
  )
}
