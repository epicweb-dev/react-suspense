import React from 'react'
import * as cn from './left-nav.module.css'

function LeftNav() {
  return (
    <div className={cn.root}>
      <div className={cn.title}>Home</div>
      <hr />
      <ul className={cn.list}>
        <li>
          <a href="#">Apply for Loan</a>
        </li>
        <li>
          <a href="#">Send Money</a>
        </li>
        <li>
          <a href="#">Request Money</a>
        </li>
        <li>
          <a href="#">Order checks</a>
        </li>
        <li>
          <a href="#">Help</a>
        </li>
        <li>
          <a href="#">Log Off</a>
        </li>
      </ul>
    </div>
  )
}

export default LeftNav

/*
eslint
  jsx-a11y/anchor-is-valid:0
*/
