import React from 'react'
import './hacks/fetch'
import './styles.css'
import codegen from 'codegen.macro'

// 🚨 PLEASE HEED ALL WARNINGS AROUND THIS WORKSHOP TELLING YOU THAT THIS
// IS UNSTABLE SOFTWARE...
// I just don't want to have to type "unstable_" prefixes everywhere
React.useTransition = React.unstable_useTransition
React.SuspenseList = React.unstable_SuspenseList

codegen`module.exports = require('@kentcdodds/react-workshop-app/codegen')({
  options: {concurrentMode: true}
})`
