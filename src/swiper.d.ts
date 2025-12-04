/**
 * Swiper CSS 类型声明
 * 用于解决 TypeScript 找不到 `swiper/css` 和 `swiper/css/effect-fade` 的类型问题
 * 这是一个全局声明文件，向 TypeScript 编译器注册这些 CSS 模块
 */

declare module 'swiper/css' {
  const content: string
  export default content
}

declare module 'swiper/css/effect-fade' {
  const content: string
  export default content
}

declare module 'swiper/css/effect-coverflow' {
  const content: string
  export default content
}

declare module 'swiper/css/effect-flip' {
  const content: string
  export default content
}

declare module 'swiper/css/effect-cube' {
  const content: string
  export default content
}

declare module 'swiper/css/navigation' {
  const content: string
  export default content
}

declare module 'swiper/css/pagination' {
  const content: string
  export default content
}

declare module 'swiper/css/scrollbar' {
  const content: string
  export default content
}

declare module 'swiper/css/a11y' {
  const content: string
  export default content
}

declare module 'swiper/css/autoplay' {
  const content: string
  export default content
}

declare module 'swiper/css/zoom' {
  const content: string
  export default content
}
