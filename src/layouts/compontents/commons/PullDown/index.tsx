import React, { useEffect, useState } from 'react'
import styles from './index.less'


export default ({data}:any) => {
  const {defaultValue,list} = data
  const [visable,setVisable] = useState(false)

  const showPullDown = () => {
    setVisable(true)
  }
  const hidePullDown = () => {
    setVisable(false)
  }
  const togglePullDown = () => {
    setVisable(v => !v)
  }
  const langChange = (item:any) => {
    setVisable(false)
  }
  
  return (
    <div className={styles.pullDownWarper} onMouseEnter={showPullDown} onMouseLeave={hidePullDown}>
      <div className={styles.defaultValue} onClick={togglePullDown}>{defaultValue}</div>
      <div className={`${styles.pullDown} pullDown`} style={{display: visable ? 'block' : 'block'}}>
        {list.map((i:any,idx:number)=>{
          const { item } = i;
          return (
            <div key={`lang_${idx}`} className={styles.item} onClick={() => langChange(item)}>{item}</div>
          )
        })}
      </div>
    </div>
  )
}
