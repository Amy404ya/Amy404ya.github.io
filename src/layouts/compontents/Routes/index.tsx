import React from 'react'
import { Link, useAppData } from 'umi'
import intl from "react-intl-universal";
import styles from './index.less'

export default () => {
  const routes = [
    { path: "/", component: "Home", name: intl.get('header.home') },
    { path: "/test", component: "Test", name: intl.get('header.home') },
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
