import React, { useEffect, useState } from 'react'
import styles from './index.less'


export default ({data,defaultValue,setDefaultValue,isChangeDefault = false}:any) => {
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
  const langChange = (i:any) => {
    setVisable(false)
    if(isChangeDefault){
      setDefaultValue(i.icon)
    }
  }
  return (
    <div className={styles.pullDownWarper} onMouseEnter={showPullDown} onMouseLeave={hidePullDown}>
      <div className={styles.defaultValue} onClick={togglePullDown}>{defaultValue}</div>
      <div className={`${styles.pullDown} pullDown`} style={{display: visable ? 'block' : 'none'}}>
        {data.map((i:any,idx:number)=>{
          const { item } = i;
          return (
            <div key={`lang_${idx}`} className={styles.item} onClick={() => langChange(i)}>{item}</div>
          )
        })}
      </div>
    </div>
  )
}
