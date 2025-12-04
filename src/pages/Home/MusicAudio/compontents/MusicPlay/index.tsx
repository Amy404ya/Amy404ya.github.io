import React, { useEffect, useRef, useState } from 'react'
import {parseLrc,LrcLine} from '@/tools'
import tracks from '../../tracks'

interface MusicAudioProps {
  // 当前播放的曲目 ID（可选，不传时显示选择器）
  currentTrackId?: string
  // 曲目切换或播放完成时的回调
  onTrackEnd?: () => void
  // 手动选择曲目时的回调
  onTrackSelect?: (trackId: string) => void
}

/**
 * MusicAudio 组件
 * - 可独立使用（显示选择器）或由父组件控制曲目
 * - 选择曲目后组件会自动加载对应的音频和 LRC
 * - 播放时根据 `timeupdate` 事件同步高亮并平滑滚动歌词
 * - 播放完成时回调 `onTrackEnd`（用于触发轮播切换）
 */
export default ({
  currentTrackId,
  onTrackEnd,
  onTrackSelect
}: MusicAudioProps = {}): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lineRefs = useRef<Array<HTMLDivElement | null>>([])

  // 目前播放的音频地址（来自 `tracks`）
  const [audioUrl, setAudioUrl] = useState<string>('')
  // 当前加载的 LRC 文本
  const [lrcText, setLrcText] = useState<string>('')
  const [lines, setLines] = useState<LrcLine[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(-1)
  // 选择的曲目 ID（如果组件不受控，则使用本地状态）
  const [selectedTrackId, setSelectedTrackId] = useState<string>('')

  useEffect(() => {
    setLines(parseLrc(lrcText))
    setCurrentIndex(-1)
  }, [lrcText])

  // 监听音频播放进度，同步歌词高亮
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => {
      const t = audio.currentTime
      if (!lines || lines.length === 0) return

      // find last line with time <= t
      let idx = -1
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].time <= t) idx = i
        else break
      }

      if (idx !== currentIndex) {
        setCurrentIndex(idx)
      }
    }

    // 监听播放完成事件
    const onEnded = () => {
      if (onTrackEnd) {
        onTrackEnd()
      }
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [lines, currentIndex, onTrackEnd])

  // 当外部传入 currentTrackId 时，自动加载该曲目
  useEffect(() => {
    if (currentTrackId) {
      onSelectTrack(currentTrackId)
    }
  }, [currentTrackId])

  useEffect(() => {
    if (currentIndex < 0) return
    const el = lineRefs.current[currentIndex]
    const container = containerRef.current
    if (el && container) {
      const top = el.offsetTop - container.clientHeight / 2 + el.clientHeight / 2
      container.scrollTo({ top, behavior: 'smooth' })
    }
  }, [currentIndex])

  // 选择曲目时调用：从 tracks 中取出 audio 与 lrc，然后设置状态
  const onSelectTrack = async (trackId: string) => {
    const t = tracks.find(tt => tt.id === trackId)
    if (!t) {
      setAudioUrl('')
      setLrcText('')
      setSelectedTrackId('')
      return
    }
    setAudioUrl(t.audio)
    setSelectedTrackId(trackId)

    // 通知父组件曲目已选择（用于轮播同步）
    if (onTrackSelect) {
      onTrackSelect(trackId)
    }

    // fetch LRC 文本（public 目录下的静态资源），并设置解析
    try {
      const res = await fetch(t.lrc)
      if (!res.ok) throw new Error('fetch lrc failed')
      const txt = await res.text()
      setLrcText(txt)
    } catch (err) {
      console.error('加载歌词失败', err)
      setLrcText('')
    }
  }

  // 当 audioUrl 变化时，尝试自动播放（如果浏览器允许）
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!audioUrl) return
    // 尝试播放，若被浏览器阻止则忽略错误
    const tryPlay = async () => {
      try {
        await audio.play()
      } catch (err) {
        // 自动播放被阻止或其他错误，静默处理
      }
    }
    tryPlay()
  }, [audioUrl])

  // 如果受控（有 currentTrackId），则隐藏选择器
  const isControlled = !!currentTrackId

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: '0 0 320px' }}>
        {/* 如果不受控，显示曲目选择器 */}
        {!isControlled && (
          <div style={{ marginBottom: 8 }}>
            <label>选择曲目：</label>
            <select
              style={{ width: '100%', padding: 6 }}
              onChange={e => onSelectTrack(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                -- 请选择 --
              </option>
              {tracks.map(t => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 音频播放器：src 来自所选曲目 */}
        <div style={{ marginTop: 12 }}>
          <audio ref={audioRef} src={audioUrl || undefined} controls style={{ width: '100%' }} />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div ref={containerRef} style={{ height: 360, overflow: 'auto', padding: 12, border: '1px solid #eee', borderRadius: 6, background: '#fafafa' }}>
          {lines.length === 0 && <div style={{ color: '#888' }}>暂无歌词，选择或输入 .lrc 文件/URL 后加载</div>}
          {lines.map((ln, i) => (
            <div
              key={`${ln.time}-${i}`}
              ref={el => (lineRefs.current[i] = el)}
              style={{
                padding: '6px 8px',
                transition: 'color 0.2s, font-size 0.2s',
                color: i === currentIndex ? '#0b79ff' : '#333',
                fontSize: i === currentIndex ? 18 : 14,
                textAlign: 'center'
              }}
            >
              {ln.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
