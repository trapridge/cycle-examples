import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import {run} from '@cycle/run'
import {div, h1, h2, h3, br, p, nav, span, ul, a, li, input, label, section} from '@cycle/dom'
import {makeDOMDriver} from '@cycle/dom'
import {makeHistoryDriver} from '@cycle/history'
import {makeHTTPDriver} from '@cycle/http'

import mdcDriver from './MdcDriver'
import * as examples from './components'

import './style.css'

function navigation(pathname) {
  return (
    nav('.mdc-list .mdc-elevation--z20',
      Object.keys(examples).map(example => a('.mdc-list-item', {
        'attrs': {'data-mdc-auto-init': 'MDCRipple', 'id': 'navigation'},        
        'dataset': {'page': example}
      }, example))
    )
  )
}

function getComponentDom$s(exampleComponents) {
  return Object.keys(exampleComponents).reduce((acc, curr) => {
    return acc.concat(exampleComponents[curr].DOM)
  }, [])
}

function findIndex(exampleComponents, name) {
  return Object.keys(exampleComponents).reduce((acc, curr, i) => {
    return curr === name ? i : acc
  }, -1)
}

function view(history$, exampleComponents) {
  return xs
    .combine(history$, ...getComponentDom$s(exampleComponents))
    .map(([history, ...componentDOMs]) => {
      const {pathname} = history
      const i = findIndex(exampleComponents, pathname.substring(1))
      const page = i > -1 ? componentDOMs[i] : h1('404 not found')

      return section('.content', [
        div('.left', [navigation(pathname)]),
        div('.right', [page])
      ])
    })
}

function main(sources) {
  const mdcAutoInit$ = sources.DOM.select(':root').elements()
  
  const history$ = sources.DOM.select('nav > a').events('click')
    .map(e => e.target.dataset.page)
    .compose(dropRepeats())

  const exampleComponents = 
    Object.keys(examples).reduce((acc, curr, i) => {
      acc[curr] = examples[curr](sources)
      return acc
    }, {})

  const vdom$ = view(sources.history, exampleComponents)

  const http$ = xs
    .merge(exampleComponents.GetRandomUser.HTTP)

  return {
    history: history$,
    DOM: vdom$,
    HTTP: http$,
    MDC: mdcAutoInit$
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
  history: makeHistoryDriver(),
  HTTP: makeHTTPDriver(),
  MDC: mdcDriver
})
