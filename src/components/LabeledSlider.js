import {renderSlider} from '../helpers/MdcDom'

let incId = 0

function randomName() {
  return LabeledSlider.name + (incId++)
}

export function intent(sources, id) {
  const newValue$ = sources.MDC.sliderInput(`#${id}`)

  return { 
    props$: sources.props, 
    newValue$,
    id: sources.id
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

export function view(state$, id) {
  return state$
    .map(state => renderSlider(state.min, state.max, state.value, state.label, state.unit, state.step, id))
}

export default function LabeledSlider(sources, id = randomName()) {
  const {props$, newValue$} = intent(sources, id)
  const state$ = model(props$, newValue$)
  const vdom$ = view(state$, id)
    
  return {
    DOM: vdom$,
    value: state$.map(state => state.value)
  }
}
