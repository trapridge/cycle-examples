import xs from 'xstream'
import {div, h1} from '@cycle/dom'

import LabeledSlider from '../LabeledSlider'
import {renderCard} from '../../helpers/MdcDom'

export function intent(sources) {
  const props$ = xs.of({
    label: 'Radius', unit: 'px', min: 25, value: 50, max: 75, step: 1
  })
  const labeledSlider = LabeledSlider({DOM: sources.DOM, props: props$, MDC: sources.MDC, id: 1})
  
  return {
    childVDom$: labeledSlider.DOM,
    childValue$: labeledSlider.value
  }
}

export function view(childValue$, childVDom$) {
  return xs
    .combine(childValue$, childVDom$)
    .map(([value, childVDom]) =>
      renderCard([
        h1('.mdc-card__title .mdc-card__title--large', Circle.name)
      ], [
        childVDom,
        div({style: {
          backgroundColor: '#58D3D8',
          width: String(2 * value) + 'px',
          height: String(2 * value) + 'px',
          borderRadius: String(value) + 'px'
        }})
      ], [])
    ) 
}

export default function Circle(sources) {
  const actions = intent(sources) 
  const vdom$ = view(actions.childValue$, actions.childVDom$)

  return {
    DOM: vdom$
  }
}