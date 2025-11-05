import React from 'react'
import { Link, useAppData } from 'umi'

export default () => {
  const routes = [
    { path: "/", component: "Home", name: '首页' },
    { path: "/test", component: "Test", name: '练功房' },
  ]

  return (
    <div>
      {routes.map((route: any) => (
        <div key={route.path as string}>
          <Link to={route.path as string}>{route.name}</Link>
        </div>
      ))}
    </div>
  )
}
