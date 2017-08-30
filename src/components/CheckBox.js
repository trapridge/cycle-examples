import {div, input, label, h2, p} from '@cycle/dom'
import xs from 'xstream'

function intent(sources) {
  return sources.DOM.select('input')
    .events('change')
    .map(ev => ev.target.checked)
}

function model(actions$) {
  return actions$
    .startWith(false)
}

function view(state$) {
  return state$
    .map(toggled =>
      div([
        h2('CheckBox'),
        input({attrs: {type: 'checkbox', id: 'c'}}),
        label({attrs: {for: 'c'}}, 'Toggle me'),
        p(toggled ? 'ON' : 'off')
      ])
    )
}

export function CheckBox(sources) {
  return {DOM: view(model(intent(sources)))}
}
