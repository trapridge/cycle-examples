import {div, label, h1, p} from '@cycle/dom'
import {renderCard, renderCheckBox} from '../../helpers/MdcDom'

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
      renderCard([
        h1('.mdc-card__title .mdc-card__title--large', CheckBox.name)
      ], [
        div('.mdc-form-field', [
          renderCheckBox(toggled),
          label({attrs: {for: 'cbox'}}, 'Toggle me'),
        ]),
        p(toggled ? 'ON' : 'off')
      ], [])
    )
}

export default function CheckBox(sources) {
  return {DOM: view(model(intent(sources)))}
}
