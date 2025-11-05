import React from 'react'
import styles from './app.less'

export function rootContainer(container: React.ReactNode) {
  return (
    <div className={styles.appWrapper}>
      {container}
    </div>
  )
}



