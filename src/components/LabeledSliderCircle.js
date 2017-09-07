import xs from 'xstream'
import {div, h2, section} from '@cycle/dom'

import LabeledSlider from './LabeledSlider'

export function intent(sources) {
  const props$ = xs.of({
    label: 'Radius', unit: 'px', min: 25, value: 50, max: 75
  });
  const labeledSlider = LabeledSlider({DOM: sources.DOM, props: props$})
  
  return {
    childVDom$: labeledSlider.DOM,
    childValue$: labeledSlider.value
  }
}

export function view(childValue$, childVDom$) {
  return xs
    .combine(childValue$, childVDom$)
    .map(([value, childVDom]) =>
      div('.mdc-card .mdc-elevation--z0', [
        section('.mdc-card__primary', [
          h2('.mdc-card__title .mdc-card__title--large', 'LabeledSliderCircle')
        ]),
        section('.mdc-card__supporting-text', [
          childVDom,
          div({style: {
            backgroundColor: '#58D3D8',
            width: String(2 * value) + 'px',
            height: String(2 * value) + 'px',
            borderRadius: String(value) + 'px'
          }})
        ]),
      ])
    )
}

export default function LabeledSliderCircle(sources) {
  const actions = intent(sources) 
  const vdom$ = view(actions.childValue$, actions.childVDom$)

  return {
    DOM: vdom$
  }
}