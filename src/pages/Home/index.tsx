import React from 'react'
import yayJap from '../../assets/yay.jpg'

export default function index() {
  return (
    <div>
      <h2>Yay! Welcome to umi! HOME 嘤嘤嘤</h2>
      <p>
        <img src={yayJap} width="388" />
      </p>
      <p>
        To get started, edit <code>pages/index.tsx</code> and save to reload.
      </p>
    </div>
  )
}
