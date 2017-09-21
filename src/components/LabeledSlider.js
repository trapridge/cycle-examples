import {renderSlider} from '../helpers/MdcDom'

let idCounter = 0

function getUniqueId() {
  return LabeledSlider.name + (idCounter++)
}

export function intent(sources, uniqueId) {
  const newValue$ = sources.MDC.sliderInput(`#${uniqueId}`)

  return { 
    props$: sources.props, 
    newValue$,
  }
}

export function model(props$, newValue$) {
  return props$
    .map(props => newValue$
      .map(value => ({...props, value}))
      .startWith(props)
    )
    .flatten()
    .remember()
}

export function view(state$, uniqueId) {
  return state$
    .map(state => renderSlider(
      state.min, 
      state.max, 
      state.value, 
      state.label, 
      state.unit, 
      state.step, 
      uniqueId
    ))
}

export default function LabeledSlider(sources, uniqueId = getUniqueId()) {
  const {props$, newValue$} = intent(sources, uniqueId)
  const state$ = model(props$, newValue$)
  const vdom$ = view(state$, uniqueId)
    
  return {
    DOM: vdom$,
    value: state$.map(state => state.value)
  }
}
