import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import {run} from '@cycle/run'
import {makeHistoryDriver} from '@cycle/history'
import {div, h1, h3, br, p, nav, span, makeDOMDriver} from '@cycle/dom'
import {makeHTTPDriver} from '@cycle/http'
import placeholderText from 'lorem-ipsum'

import * as examples from './components'

function navigation(pathname) {
  return nav([
    ...Object.keys(examples).map(example => 
      span({
        dataset: {page: example},
        class: {'active': pathname === ('/' + example)}
      }, example)
    )
  ])
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
      return div([
        navigation(pathname),
        page,
      ])
    })
}

function main(sources) {
  const exampleComponents = 
    Object.keys(examples).reduce((acc, curr, i) => {
      acc[curr] = examples[curr](sources)
      return acc
    }, {})

  const history$ = sources.DOM.select('nav>span').events('click')
    .map(e => e.target.dataset.page)
    .compose(dropRepeats())

  const vdom$ = view(sources.history, exampleComponents)

  const http$ = xs
    .merge(exampleComponents.GetRandomUser.HTTP)

  return {
    history: history$,
    DOM: vdom$,
    HTTP: http$ 
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
  history: makeHistoryDriver(),
  HTTP: makeHTTPDriver()
})