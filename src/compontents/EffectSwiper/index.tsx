import React, { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
// 不显式导入模块，使用基础 Swiper 行为即可满足当前需求（避免类型/打包差异）
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/effect-coverflow'
import 'swiper/css/effect-cube'
import 'swiper/css/effect-flip'
import styles from './index.less'

type EffectName = 'zoom-fade' | 'coverflow' | 'cube' | 'flip' | 'fade'

interface EffectSwiperProps {
  children: React.ReactNode[] | React.ReactNode
  ids?: string[] // 可选：每一项对应的 id，用于外部以 id 控制轮播
  activeId?: string // 当前激活的 id（受控）
  onSlideChange?: (activeIdOrIndex: string | number) => void
  effect?: EffectName
  autoplayDelay?: number // 毫秒，0 表示不自动播放
  loop?: boolean
}

export default function EffectSwiper({
  children,
  ids,
  activeId,
  onSlideChange,
  effect = 'zoom-fade',
  autoplayDelay = 0,
  loop = true,
}: EffectSwiperProps) {
  const swiperRef = useRef<any>(null)

  // 目前使用基础 Swiper，不注入额外模块以避免不同版本间的路径问题
  const modules: any[] = []

  // 当外部 activeId 变更时，跳转到对应 slide
  useEffect(() => {
    if (!ids || !activeId) return
    const targetIndex = ids.findIndex((i) => i === activeId)
    if (targetIndex === -1) return
    const swiper = swiperRef.current
    if (!swiper) return
    try {
      // 在 loop 模式下使用 slideToLoop 可正确映射到复制幻灯片
      // 先比较当前真实索引，若已经在目标位置则不重复触发，避免来回切换
      const currentReal = typeof swiper.realIndex === 'number' ? swiper.realIndex : swiper.activeIndex
      if (currentReal === targetIndex) return
      if (loop && typeof swiper.slideToLoop === 'function') {
        swiper.slideToLoop(targetIndex, 300)
      } else if (typeof swiper.slideTo === 'function') {
        swiper.slideTo(targetIndex, 300)
      }
    } catch (e) {
      // ignore
    }
  }, [ids, activeId, loop])

  // 过渡结束时通知外部当前激活项
  const handleTransitionEnd = (swiper: any) => {
    // 尝试获取真实的数据索引
    let idx: number | undefined
    // Swiper 在 loop 模式下提供 realIndex
    if (typeof swiper.realIndex === 'number') idx = swiper.realIndex
    // 兼容：data-swiper-slide-index 属性（某些版本或自定义场景）
    if (idx === undefined) {
      try {
        const el = swiper.slides?.[swiper.activeIndex]
        const attr = el?.getAttribute?.('data-swiper-slide-index')
        if (typeof attr === 'string') idx = parseInt(attr, 10)
      } catch (e) {
        // ignore
      }
    }
    // 最后回退为 activeIndex（确保为 number）
    if (idx === undefined) {
      const ai = swiper.activeIndex
      if (typeof ai === 'number') {
        // 如果提供了 ids 列表，activeIndex 在 loop 模式下可能偏移，使用模运算回退
        if (ids && ids.length > 0) {
          idx = ai % ids.length
        } else {
          idx = ai
        }
      }
    }
    if (idx === undefined) return

    // 非生产环境打印调试信息，帮助定位左右切换映射问题
    try {
      if (process.env.NODE_ENV !== 'production') {
        // 收集 slides 上的 data-swiper-slide-index 用于调试
        const slideAttrs = Array.from(swiper.slides || []).map((el: any) => {
          try { return el.getAttribute && el.getAttribute('data-swiper-slide-index') } catch (e) { return null }
        })
        // eslint-disable-next-line no-console
        console.debug('[EffectSwiper] transitionEnd', { previousIndex: swiper.previousIndex, activeIndex: swiper.activeIndex, realIndex: swiper.realIndex, resolvedIdx: idx, slideAttrs })
      }
    } catch (e) {
      // ignore
    }
    if (ids && Array.isArray(ids)) {
      const id = ids[idx]
      if (id !== undefined) onSlideChange?.(id)
      else onSlideChange?.(idx)
    } else {
      onSlideChange?.(idx)
    }
  }

  // 渲染 children 为 SwiperSlide
  const slides = Array.isArray(children) ? children : [children]

  return (
    <div className={`${styles.effectSwiperContainer} effect-${effect}`}>
      <Swiper
        modules={modules}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChangeTransitionEnd={handleTransitionEnd}
        loop={loop}
        centeredSlides={true}
        slidesPerView={1}
        spaceBetween={18}
        autoplay={autoplayDelay && autoplayDelay > 0 ? { delay: autoplayDelay, disableOnInteraction: false } : false}
        // 视觉效果可通过 className + CSS 控制，例如 effect-zoom-fade
      >
        {slides.map((child, i) => (
          <SwiperSlide key={ids && ids[i] ? ids[i] : i}>{child}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}