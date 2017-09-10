import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {makeHistoryDriver} from '@cycle/history'
import {makeHTTPDriver} from '@cycle/http'

import {makeMDCDriver} from './MDCDriver'
import App from './App'

run(App, {
  DOM: makeDOMDriver('#app'),
  history: makeHistoryDriver(),
  HTTP: makeHTTPDriver(),
  MDC: makeMDCDriver()
})
