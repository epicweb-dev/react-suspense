import './styles.css'
import React from 'react'
import ReactDOM from 'react-dom'
import preval from 'preval.macro'
import createWorkshopApp from '@kentcdodds/react-workshop-app'
import pkg from '../package.json'
import fakeFetchResponses from './hacks/fetch'

const exerciseInfo = preval`module.exports = require('@kentcdodds/react-workshop-app/load-exercises')`

const WorkshopApp = createWorkshopApp({
  getExerciseImport: id => () => import(`./exercises/${id}.js`),
  getFinalImport: id => () => import(`./exercises-final/${id}.js`),
  getExampleImport: id => () => import(`./examples/${id}.js`),
  exerciseInfo,
  projectTitle: pkg.title,
  fakeFetchResponses,
})

const rootEl = document.getElementById('⚛')

const root = ReactDOM.createRoot(rootEl)
root.render(<WorkshopApp />)
// to enable sync mode, comment out the above stuff and comment this in.
// ReactDOM.render(<WorkshopApp />, rootEl)
