import './hacks'
import 'normalize.css/normalize.css'
import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom'
import MainApp from './app'

const rootEl = document.getElementById('⚛')
const root = ReactDOM.createRoot(rootEl)
root.render(<MainApp />)

// to enable sync mode, comment out the above stuff and comment this in.
// ReactDOM.render(<MainApp />, rootEl)
