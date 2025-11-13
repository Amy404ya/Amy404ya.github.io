import React, { useEffect, useState } from 'react'
import PullDown from '../commons/PullDown'
import { langChangeUrl,addLocaleToLink } from '@/tools/index'
import ChineseImg from '@/assets/lang/Chinese.png'
import EnglishImg from '@/assets/lang/English.png'
import JapaneseImg from '@/assets/lang/Japanese.png'
import KoreanImg from '@/assets/lang/Korean.png'
import styles from './index.less'

export default () => {
  const pullDown = [
      {
        tag:"zh-CN",
        item: <div className={styles.item}>
                <div><img className={styles.icon} src={ChineseImg} /></div>
                <div>中文</div>
              </div>,
        icon: <img className={styles.icon} src={ChineseImg} />
      },
      {
        tag:"en-US",
        item: <div className={styles.item}>
                <img className={styles.icon} src={EnglishImg} />
                <div>English</div>
              </div>,
        icon: <img className={styles.icon} src={EnglishImg} />
      },
      {
        tag:"ja-JP",
        item: <div className={styles.item}>
                <img className={styles.icon} src={JapaneseImg} />
                <div>日文</div>
              </div>,
        icon: <img className={styles.icon} src={JapaneseImg} />
      },
      {
        tag:"ko-KR",
        item: <div className={styles.item}>
                <img className={styles.icon} src={KoreanImg} />
                <div>韩文</div>
              </div>,
        icon: <img className={styles.icon} src={KoreanImg} />
      },
    ]
  const [defaultValue,setDefaultValue] = useState(pullDown[0].icon)

  useEffect(() => {
    var searchParams = new URLSearchParams(location.search);
      if (searchParams.has('locale')) {
        var localeValue = searchParams.get('locale');
        for (var i = 0; i < pullDown.length; i++) {
          if (pullDown[i].tag === localeValue) {
            setDefaultValue(pullDown[i].icon);
            break;
          }
        }
      }
  },[])

  const moreChange = (i:any) => {
    setDefaultValue(i.icon)
    langChangeUrl(i)
  }
  return (
    <div className={`${styles['languageWrap']}`}>
      <PullDown moreChange={moreChange} data={pullDown} isChangeDefault={true} setDefaultValue={setDefaultValue} defaultValue={defaultValue}/>
    </div>
  )
}
