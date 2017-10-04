import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import {div, h1, p, nav, a, section} from '@cycle/dom'

import * as examples from './components'
import {renderCard} from './helpers/MdcDom'
import './layout.css'

function renderNavigation() {
  return (
    nav('.mdc-list .mdc-elevation--z20',
      Object.keys(examples).map(example => a('.mdc-list-item', {
        'attrs': {'data-mdc-auto-init': 'MDCRipple', 'id': 'renderNavigation'},
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

function renderInfo() {
  return (
    renderCard([
      h1('.mdc-card__title .mdc-card__title--large', 'Cycle.js examples')
    ], [
      p(['Adopted & refactored and original examples of ', 
        a({attrs: {'href': 'https://cycle.js.org/'}}, 'Cycle.js'), 
        ' components styled with ',
        a({attrs: {'href': 'https://material.io/components/web/'}}, 'Material Components'),
        '. Source code in ',
        a({attrs: {'href': 'https://github.com/trapridge/cycle-examples'}}, 'Github'),
        '.'
      ])
    ], [])
  )
}

function view(history$, exampleComponents) {
  return xs
    .combine(history$, ...getComponentDom$s(exampleComponents))
    .map(([history, ...componentDOMs]) => {
      const {pathname} = history
      const i = findIndex(exampleComponents, pathname.substring(1))
      const page = i > -1 ? componentDOMs[i] : renderInfo()

      return section('.content .mdc-typography', [
        div('.left', [renderNavigation(pathname)]),
        div('.right', [page])
      ])
    })
}

export default function App(sources) {
  const mdcAutoInit$ = sources.DOM.select(':root').elements()
  
  const history$ = sources.DOM.select('nav > a').events('click')
    .map(e => e.target.dataset.page)
    .compose(dropRepeats())

  const exampleComponents = 
    Object.keys(examples).reduce((acc, curr) => {
      acc[curr] = examples[curr](sources)
      return acc
    }, {})

  const vdom$ = view(sources.history, exampleComponents)

  const http$ = xs
    .merge(exampleComponents.RandomUser.HTTP)

  return {
    history: history$,
    DOM: vdom$,
    HTTP: http$,
    MDC: mdcAutoInit$
  }
}