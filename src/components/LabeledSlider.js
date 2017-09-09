import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import {div, span, svg, input, label} from '@cycle/dom'

export function intent(sources) {
  const newValue$ = sources.MDC.sliderChange(`#slider-id-${sources.id}`)

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

function renderSlider(minVal, maxVal, nowVal, _label, unit, step, id) {
  return (
    div([
      label({attrs: {for: `slider-id-${id}`}}, `${_label}: ${nowVal} ${unit}`),
      div(`.mdc-slider`, {
        attrs: {
          'data-mdc-auto-init': 'MDCSlider',    
          'tabindex': id, 
          'role': 'slider', 
          'aria-valuemin': minVal, 
          'aria-valuemax': maxVal, 
          'aria-valuenow': nowVal,
          'aria-label': label,
          'id': `slider-id-${id}`,
          'data-step': step

        }
      }, [
        div('.mdc-slider__track-container', [
          div('.mdc-slider__track')
        ]),
        div('.mdc-slider__thumb-container', [
          div('.mdc-slider__pin', [
            span('.mdc-slider__pin-value-marker')
          ]),
          svg('.mdc-slider__thumb', {
            attrs: {
              'width': '21',
              'height': '21'
            }
          }, [
            svg.circle({
              attrs: {
                cx: '10.5',
                cy: '10.5',
                r: '7.875'
              }
            })
          ]),
          div('.mdc-slider__focus-ring')
        ])
      ])

    ])
  )
}

export function view(state$, id) {
  return state$
    .map(state => renderSlider(state.min, state.max, state.value, state.label, state.unit, state.step, id))
}

export default function LabeledSlider(sources) {
  const {props$, newValue$, id} = intent(sources)
  const state$ = model(props$, newValue$)
  const vdom$ = view(state$, id)
    
  return {
    DOM: vdom$,
    value: state$.map(state => state.value)
  }
}
