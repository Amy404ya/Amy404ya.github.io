import React, { useMemo } from 'react'
import sourse from './index.json'
import styles from './index.less'

export default () => {
  // 从数组中随机取一项
  const randomQuote = useMemo(() => {
    const quotes = sourse?.dailyQuote || []
    if (quotes.length === 0) return null
    const randomIndex = Math.floor(Math.random() * quotes.length)
    return quotes[randomIndex]
  }, [])

  if (!randomQuote) return null

  return (
    <div className={styles.dailyQuote}>
      <span>{randomQuote.quote}</span>
      {(randomQuote.source || randomQuote.author) && <span>——{randomQuote.source || randomQuote.author}</span>}
    </div>
  )
}
