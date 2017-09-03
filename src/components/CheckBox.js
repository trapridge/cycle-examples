import {div, input, label, h2, p} from '@cycle/dom'

export function intent(sources) {
  return sources.DOM.select('input').events('change')
    .map(ev => ev.target.checked)
    .startWith(false)
}

export function model(actions$) {
  return actions$
}

export function view(state$) {
  return state$
    .map(toggled =>
      div('.example', [
        h2('CheckBox'),
        input({attrs: {type: 'checkbox', id: 'c'}}),
        label({attrs: {for: 'c'}}, 'Toggle me'),
        p(toggled ? 'ON' : 'off')
      ])
    )
}

export default function CheckBox(sources) {
  return {DOM: view(model(intent(sources)))}
}
