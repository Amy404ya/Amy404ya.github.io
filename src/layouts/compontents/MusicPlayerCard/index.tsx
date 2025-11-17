import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.less'

type LyricLine = {
  time: number
  text: string
}

type Song = {
  id: string
  title: string
  artist: string
  coverGradient: string
  coverImage?: string
  accentColor: string
  duration: number
  audioSrc: string
  lyrics: LyricLine[]
}

const songs: Song[] = [
  {
    id: 'shengxia-original',
    title: '盛夏的果实 (原版)',
    artist: '莫文蔚',
    coverGradient: 'linear-gradient(135deg, rgba(255,154,158,0.9) 0%, rgba(250,208,196,0.85) 45%, rgba(161,196,253,0.92) 100%)',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#f7a6b1',
    duration: 256,
    audioSrc: '/mock-audio/karen-mok-summer-fruit-original.mp3',
    lyrics: [
      { time: 0, text: '也许放弃才能靠近你' },
      { time: 14, text: '不再见你你才会把我记起' },
      { time: 29, text: '时间累积这盛夏的果实' },
      { time: 44, text: '回忆里寂寞的香气' },
      { time: 58, text: '我要试着离开你' },
      { time: 72, text: '不要再想你虽然这并不是我本意' },
      { time: 90, text: '你曾说过会永远爱我' },
      { time: 104, text: '也许承诺不过因为热情' },
      { time: 118, text: '亲爱的那不是爱情' },
      { time: 134, text: '爱情里没有谁对不起谁' },
      { time: 148, text: '只有谁不懂得珍惜谁' },
      { time: 166, text: '如果还能再见你' },
      { time: 180, text: '我会微笑说好久不见' },
      { time: 196, text: '早该知道这样会让我伤心' },
      { time: 214, text: '你总是天下无敌' },
      { time: 232, text: '你不要再欺骗自己' }
    ]
  },
  {
    id: 'shengxia-live',
    title: '盛夏的果实 (Live in Hong Kong)',
    artist: '莫文蔚',
    coverGradient: 'linear-gradient(135deg, rgba(255,194,180,0.9) 0%, rgba(255,159,196,0.85) 50%, rgba(255,234,167,0.92) 100%)',
    coverImage: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#ff9d99',
    duration: 268,
    audioSrc: '/mock-audio/karen-mok-summer-fruit-live.mp3',
    lyrics: [
      { time: 0, text: '也许放弃才能靠近你' },
      { time: 16, text: '不再见你你才会把我记起' },
      { time: 32, text: '时间累积这盛夏的果实' },
      { time: 48, text: '回忆里寂寞的香气' },
      { time: 64, text: '我要试着离开你' },
      { time: 82, text: '不要再想你虽然这并不是我本意' },
      { time: 102, text: '你曾说过会永远爱我' },
      { time: 118, text: '也许承诺不过因为热情' },
      { time: 134, text: '亲爱的那不是爱情' },
      { time: 150, text: '爱情里没有谁对不起谁' },
      { time: 170, text: '只有谁不懂得珍惜谁' },
      { time: 188, text: '如果还能再见你' },
      { time: 206, text: '我会微笑说好久不见' },
      { time: 226, text: '早该知道这样会让我伤心' },
      { time: 244, text: '你总是天下无敌' }
    ]
  },
  {
    id: 'shengxia-acoustic',
    title: '盛夏的果实 (Unplugged)',
    artist: '莫文蔚',
    coverGradient: 'linear-gradient(135deg, rgba(195,255,222,0.95) 0%, rgba(255,233,186,0.92) 50%, rgba(255,206,206,0.88) 100%)',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#97d3b6',
    duration: 240,
    audioSrc: '/mock-audio/karen-mok-summer-fruit-acoustic.mp3',
    lyrics: [
      { time: 0, text: '也许放弃才能靠近你' },
      { time: 15, text: '不再见你你才会把我记起' },
      { time: 30, text: '时间累积这盛夏的果实' },
      { time: 46, text: '回忆里寂寞的香气' },
      { time: 61, text: '我要试着离开你' },
      { time: 76, text: '不要再想你虽然这并不是我本意' },
      { time: 94, text: '你曾说过会永远爱我' },
      { time: 110, text: '也许承诺不过因为热情' },
      { time: 126, text: '亲爱的那不是爱情' },
      { time: 142, text: '爱情里没有谁对不起谁' },
      { time: 158, text: '只有谁不懂得珍惜谁' },
      { time: 176, text: '如果还能再见你' },
      { time: 192, text: '我会微笑说好久不见' },
      { time: 210, text: '早该知道这样会让我伤心' },
      { time: 226, text: '你总是天下无敌' }
    ]
  }
]

const formatTime = (value: number) => {
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const playModes = ['循环', '单曲', '随机'] as const

const MusicPlayerCard: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(songs[0].duration)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playModeIndex, setPlayModeIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSong = songs[currentSongIndex]

  const activeLyricIndex = useMemo(() => {
    const index = currentSong.lyrics.findIndex((line, lineIndex) => {
      const nextLine = currentSong.lyrics[lineIndex + 1]
      if (!nextLine) {
        return progress >= line.time
      }
      return progress >= line.time && progress < nextLine.time
    })
    return index === -1 ? currentSong.lyrics.length - 1 : index
  }, [currentSong, progress])

  const displayedLyrics = useMemo(() => {
    const start = Math.max(activeLyricIndex - 2, 0)
    const end = Math.min(activeLyricIndex + 3, currentSong.lyrics.length)
    return currentSong.lyrics.slice(start, end).map((line, idx) => ({
      ...line,
      absoluteIndex: start + idx
    }))
  }, [activeLyricIndex, currentSong])

  const handlePrev = useCallback(() => {
    setCurrentSongIndex(prev => (prev === 0 ? songs.length - 1 : prev - 1))
  }, [])

  const handleNext = useCallback((random = false) => {
    setCurrentSongIndex(prev => {
      if (random) {
        let nextIndex = prev
        while (nextIndex === prev) {
          nextIndex = Math.floor(Math.random() * songs.length)
        }
        return nextIndex
      }
      return prev === songs.length - 1 ? 0 : prev + 1
    })
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentSong.duration)
    }

    const handleEnded = () => {
      if (playModes[playModeIndex] === '单曲') {
        audio.currentTime = 0
        setProgress(0)
        audio.play().catch(() => {
          setIsPlaying(false)
        })
      } else {
        handleNext(playModes[playModeIndex] === '随机')
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong, handleNext, playModeIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    audio.src = currentSong.audioSrc
    audio.currentTime = 0
    setProgress(0)
    setDuration(currentSong.duration)

    // 确保新的音频资源加载完成后再播放
    const playIfNeeded = () => {
      if (isPlaying) {
        audio.play().catch(() => {
          setIsPlaying(false)
        })
      }
    }

    audio.load()

    if (audio.readyState >= 2) {
      playIfNeeded()
    } else {
      const onCanPlay = () => {
        playIfNeeded()
        audio.removeEventListener('canplaythrough', onCanPlay)
      }
      audio.addEventListener('canplaythrough', onCanPlay)
    }

    return () => {
      audio.pause()
    }
  }, [currentSongIndex, currentSong, handleNext, isPlaying])

  const handleProgressChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const value = Number(event.target.value)
    setProgress(value)
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = value
    }
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (!isPlaying && progress >= duration) {
      audio.currentTime = 0
      setProgress(0)
    }

    setIsPlaying(prev => !prev)
  }

  const togglePlayMode = () => {
    setPlayModeIndex(prev => (prev + 1) % playModes.length)
  }

  const toggleMuted = () => {
    setMuted(prev => !prev)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.muted = muted
    }
  }, [muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise) {
        playPromise.catch(() => {
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    setDuration(currentSong.duration)
  }, [currentSong])

  const progressPercent = duration ? Math.min((progress / duration) * 100, 100) : 0

  return (
    <div className={styles.musicPlayerCard}>
      <audio ref={audioRef} preload='metadata' style={{ display: 'none' }} />
      <div className={styles.carouselSection}>
        <button className={styles.carouselButton} onClick={handlePrev} aria-label='上一首'>
          ▲
        </button>
        <div
          className={styles.coverPanel}
          style={{
            backgroundImage: currentSong.coverImage
              ? `${currentSong.coverGradient}, url(${currentSong.coverImage})`
              : currentSong.coverGradient
          }}
        >
          <div className={styles.coverOverlay} />
          <div className={styles.coverContent}>
            <span className={styles.coverBadge}>每日推送</span>
            <h3>{currentSong.title}</h3>
            <p>{currentSong.artist}</p>
          </div>
        </div>
        <button className={styles.carouselButton} onClick={() => handleNext(playModes[playModeIndex] === '随机')} aria-label='下一首'>
          ▼
        </button>
      </div>

      <div className={styles.lyricSection}>
        <div className={styles.lyricList}>
          {displayedLyrics.map(line => {
            const isActive = line.absoluteIndex === activeLyricIndex
            return (
              <p
                key={`${currentSong.id}-${line.time}`}
                className={isActive ? styles.activeLyric : styles.lyricLine}
                style={isActive ? { color: currentSong.accentColor } : undefined}
              >
                {line.text}
              </p>
            )
          })}
        </div>

        <div className={styles.progressRow}>
          <span className={styles.timeText}>{formatTime(progress)}</span>
          <div className={styles.progressBar}>
            <div className={styles.progressTrack} />
            <div className={styles.progressFill} style={{ width: `${progressPercent}%`, background: currentSong.accentColor }} />
            <input
              type='range'
              min={0}
              max={duration}
              step={0.1}
              value={progress}
              onChange={handleProgressChange}
              aria-label='播放进度'
            />
          </div>
          <span className={styles.timeText}>{formatTime(duration)}</span>
        </div>

        <div className={styles.playbackRow}>
          <button className={styles.roundButton} onClick={togglePlay} aria-label={isPlaying ? '暂停' : '播放'}>
            {isPlaying ? '⏸' : '▶️'}
          </button>
          <div className={styles.songMeta}>
            <span className={styles.songTitle}>{currentSong.title}</span>
            <span className={styles.songArtist}>{currentSong.artist}</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button className={styles.controlButton} onClick={togglePlayMode}>
          <span className={styles.icon}>{playModes[playModeIndex] === '随机' ? '🔀' : playModes[playModeIndex] === '单曲' ? '🔁' : '🔂'}</span>
          <span>播放方式 · {playModes[playModeIndex]}</span>
        </button>
        <button className={styles.controlButton} onClick={toggleMuted}>
          <span className={styles.icon}>{muted ? '🔇' : '🔊'}</span>
          <span>播放声音 · {muted ? '静音' : '开启'}</span>
        </button>
        <button className={styles.controlButton}>
          <span className={styles.icon}>📃</span>
          <span>待播菜单</span>
        </button>
      </div>
    </div>
  )
}

export default MusicPlayerCard


