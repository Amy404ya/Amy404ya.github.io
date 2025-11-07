import React, { useState } from 'react'
import PullDown from '../commons/PullDown'
import ChineseImg from '@/assets/lang/Chinese.png'
import EnglishImg from '@/assets/lang/English.png'
import JapaneseImg from '@/assets/lang/Japanese.png'
import KoreanImg from '@/assets/lang/Korean.png'
import styles from './index.less'

export default () => {
  const pullDown = [
      {
        item: <div className={styles.item}>
                <div><img className={styles.icon} src={ChineseImg} /></div>
                <div>中文</div>
              </div>,
        icon: <img className={styles.icon} src={ChineseImg} />
      },
      {
        item: <div className={styles.item}>
                <img className={styles.icon} src={EnglishImg} />
                <div>English</div>
              </div>,
        icon: <img className={styles.icon} src={EnglishImg} />
      },
      {
        item: <div className={styles.item}>
                <img className={styles.icon} src={JapaneseImg} />
                <div>日文</div>
              </div>,
        icon: <img className={styles.icon} src={JapaneseImg} />
      },
      {
        item: <div className={styles.item}>
                <img className={styles.icon} src={KoreanImg} />
                <div>韩文</div>
              </div>,
        icon: <img className={styles.icon} src={KoreanImg} />
      },
    ]
  const [defaultValue,setDefaultValue] = useState(pullDown[0].icon)

  return (
    <div className={`${styles['languageWrap']}`}>
      <PullDown data={pullDown} isChangeDefault={true} setDefaultValue={setDefaultValue} defaultValue={defaultValue}/>
    </div>
  )
}
