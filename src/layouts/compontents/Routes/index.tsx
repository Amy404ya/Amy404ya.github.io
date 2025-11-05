import React from 'react'
import { Link, useAppData } from 'umi'
import styles from './index.less'

export default () => {
  const routes = [
    { path: "/", component: "Home", name: '首页' },
    { path: "/test", component: "Test", name: '练功房' },
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
