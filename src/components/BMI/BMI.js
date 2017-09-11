import xs from 'xstream'
import {h1, p} from '@cycle/dom'
import isolate from '@cycle/isolate'
import Immutable from 'immutable'

import LabeledSlider from '../LabeledSlider'
import {renderCard} from '../../helpers/MdcDom'

export function reducers(actions) {
  const weightReducer$ = actions.weightValue$
    .map(weight => function setWeightReducer(state) {
      return state.set('weight', weight)
    })

  const heightReducer$ = actions.heightValue$
    .map(height => function setWeightReducer(state) {
      return state.set('height', height)
    })

  const bmiReducer$ = xs.merge(weightReducer$, heightReducer$)
    .map(() => function setBmiReducer(state) {
      const weight = state.get('weight')
      const height = state.get('height')
      const heightMeters = height * 0.01
      const bmi = Math.round(weight / (heightMeters * heightMeters))
      return state.set('bmi', bmi)
    })
  
  return xs.merge(
    weightReducer$, 
    heightReducer$, 
    bmiReducer$
  )
}

export function model(actions) {
  const reducer$ = reducers(actions)
  const state$ = xs.of(Immutable.Map())
    .map(state => reducer$.fold((acc, reducer) => reducer(acc), state))
    .flatten()

  return state$
}

export function view(state$, weightVDom$, heightVDom$) {
  return xs.combine(state$, weightVDom$, heightVDom$)
    .map(([state, weightVDom, heightVDom]) => {
      return (
        renderCard([
          h1('.mdc-card__title .mdc-card__title--large', BMI.name)
        ], [
          weightVDom,
          heightVDom,
          p('BMI is ' + state.get('bmi'))
        ], [])
      )
    })
}

export default function BMI(sources) {
  const weightProps$ = xs.of({
    label: 'Weight', unit: 'kg', min: 40, value: 70, max: 150, step: 0.5
  })
  const heightProps$ = xs.of({
    label: 'Height', unit: 'cm', min: 100, value: 170, max: 230, step: 1
  })

  const weightSources = {
    DOM: sources.DOM, 
    props: weightProps$, 
    MDC: sources.MDC
  }
  const heightSources = {
    DOM: sources.DOM, 
    props: heightProps$, 
    MDC: sources.MDC
  }

  const weightSlider = isolate(LabeledSlider, 'w')(weightSources)
  const heightSlider = isolate(LabeledSlider, 'h')(heightSources)

  const state$ = model({
    weightValue$: weightSlider.value, 
    heightValue$: heightSlider.value
  })
  const vdom$ = view(state$, weightSlider.DOM, heightSlider.DOM)

  return {
    DOM: vdom$
  }
}

