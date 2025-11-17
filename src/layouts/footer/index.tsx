import React from 'react'
import intl from "react-intl-universal";
import styles from './index.less'

export default () => {
  return (
    <div className={`${styles.footer} footer`}>
      {intl.get('footer.copyright')} © {new Date().getFullYear()} Amy
    </div>
  )
}
