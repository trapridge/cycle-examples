import {div, span, input} from '@cycle/dom'

export function intent(sources) {  
  const newValue$ = sources.DOM.select('.slider').events('input')
    .map(ev => ev.target.value)

  return { 
    props$: sources.props, 
    newValue$ 
  }
}

export function model(props$, newValue$) {
  return props$
    .map(props => newValue$
      .map(val => ({
        label: props.label, 
        unit: props.unit,
        min: props.min, 
        value: val, 
        max: props.max
      }))
      .startWith(props)
    )
    .flatten()
    .remember()
}

export function view(state$) {
  return state$
    .map(state =>
      div('.labeled-slider', [
        input('.slider', {
          attrs: {
            type: 'range', min: state.min, max: state.max, value: state.value
          }
        }),
        span('.label', state.label + ' ' + state.value + state.unit)
      ])
    )
}

export default function LabeledSlider(sources) {
  const {props$, newValue$} = intent(sources)
  const state$ = model(props$, newValue$)
  const vdom$ = view(state$)
    
  return {
    DOM: vdom$,
    value: state$.map(state => state.value)
  }
}
