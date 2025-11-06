import React from 'react'
import PullDown from '../commons/PullDown'
import ChineseImg from '@/assets/lang/Chinese.png'
import EnglishImg from '@/assets/lang/English.png'
import JapaneseImg from '@/assets/lang/Japanese.png'
import KoreanImg from '@/assets/lang/Korean.png'
import styles from './index.less'

export default () => {
  const pullDown = {
    defaultValue: <img className={styles.icon} src={ChineseImg} />,
    list: [
      {
        item: <div className={styles.item}>
                <div><img className={styles.icon} src={ChineseImg} /></div>
                <div>中文</div>
              </div>
      },
      {
        item: <div className={styles.item}>
                <img className={styles.icon} src={EnglishImg} />
                <div>English</div>
              </div>
      },
      {
        item: <div className={styles.item}>
                <img className={styles.icon} src={JapaneseImg} />
                <div>日文</div>
              </div>
      },
      {
        item: <div className={styles.item}>
                <img className={styles.icon} src={KoreanImg} />
                <div>韩文</div>
              </div>
      },
    ]
  }

  return (
    <div className={`${styles['languageWrap']}`}>
      <PullDown data={pullDown}/>
    </div>
  )
}
