import './hacks/fetch'
import './styles.css'
import codegen from 'codegen.macro'

codegen`module.exports = require('@kentcdodds/react-workshop-app/codegen')({
  options: {concurrentMode: true}
})`
