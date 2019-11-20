import React from 'react'
import * as cn from './spinner.module.css'

function Spinner() {
  return <img className={cn.pulse} src="/img/pokeball.png" alt="loading" />
}

export default Spinner
