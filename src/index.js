import './hacks'
import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom'
import MainApp from './app'

// this just makes rapid debugging/playing around with React APIs in the console easier.
window.React = React
window.ReactDOM = ReactDOM

const rootEl = document.getElementById('⚛')
const root = ReactDOM.createRoot(rootEl)
root.render(<MainApp />)

// to enable sync mode, comment out the above stuff and comment this in.
// ReactDOM.render(<App />, rootEl)
