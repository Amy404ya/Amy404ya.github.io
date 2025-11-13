import React from 'react'
import { Link, useAppData } from 'umi'
import { addLocaleToLink } from '@/tools/index'
import intl from "react-intl-universal";
import styles from './index.less'

export default () => {
  const routes = [
    { path: addLocaleToLink("/"), component: "Home", name: intl.get('header.home') },
    { path: addLocaleToLink("/test"), component: "Test", name: intl.get('header.test') },
  ]

  return (
    <div className={styles.routesWrap}>
      {routes.map((route: any) => (
        <div key={route.path as string} className={styles.linkItem}>
          <Link to={route.path as string}>{route.name}</Link>
        </div>
      ))}
    </div>
  )
}
