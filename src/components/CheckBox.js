import {div, input, label, h2, section, p, svg, path} from '@cycle/dom'

export function intent(sources) {
  return sources.DOM.select('input').events('change')
    .map(ev => ev.target.checked)
    .startWith(false)
}

export function model(actions$) {
  return actions$
}

function renderCheckBox(checked) {
  return (
    div('.mdc-checkbox', {attrs: {'id': 'cbox2', 'data-mdc-auto-init': 'MDCCheckbox'}}, [
      input(
        '.mdc-checkbox__native-control', 
        {attrs: {'type': 'checkbox', 'id': 'cbox', 'checked': checked}}
      ),
      div('.mdc-checkbox__background', [
        svg(
          '.mdc-checkbox__checkmark', 
          {attrs: {'viewBox': '0 0 24 24'}}, [
            svg.path(
              '.mdc-checkbox__checkmark__path', 
              {attrs: {
                'fill': 'none', 
                'stroke': 'white', 
                'd': 'M1.73,12.91 8.1,19.28 22.79,4.59'
              }}
            )
        ]),
        div('.mdc-checkbox__mixedmark')
      ])
    ])
  )
}

export function view(state$) {
  return state$
    .map(toggled =>
      div('.mdc-card .mdc-elevation--z0', [
        section('.mdc-card__primary', [
          h2('.mdc-card__title .mdc-card__title--large', 'CheckBox')
        ]),
        section('.mdc-card__supporting-text', [
          // input({attrs: {type: 'checkbox', id: 'c'}}),
          div('.mdc-form-field', [
            renderCheckBox(toggled),
            label({attrs: {for: 'cbox'}}, 'Toggle me'),
          ]),
          p(toggled ? 'ON' : 'off')
        ]),
      ])
    )
}

export default function CheckBox(sources) {
  return {DOM: view(model(intent(sources)))}
}
