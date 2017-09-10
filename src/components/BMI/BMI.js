import xs from 'xstream'
import {h1, p} from '@cycle/dom'
import isolate from '@cycle/isolate'

import LabeledSlider from '../LabeledSlider'
import {renderCard} from '../../helpers/MdcDom'

export function intent(sources) {
  const weightProps$ = xs.of({
    label: 'Weight', unit: 'kg', min: 40, value: 70, max: 150, step: 0.5
  })
  const heightProps$ = xs.of({
    label: 'Height', unit: 'cm', min: 100, value: 170, max: 230, step: 1
  })

  const weightSources = {DOM: sources.DOM, props: weightProps$, MDC: sources.MDC, id: 2}
  const heightSources = {DOM: sources.DOM, props: heightProps$, MDC: sources.MDC, id: 3}

  const weightSlider = isolate(LabeledSlider, 'w')(weightSources)
  const heightSlider = isolate(LabeledSlider, 'h')(heightSources)

  return {
    weightVDom$: weightSlider.DOM,
    weightValue$: weightSlider.value,
    heightVDom$: heightSlider.DOM,
    heightValue$: heightSlider.value,
  }
}

export function model(weightValue$, heightValue$) {
  return xs.combine(weightValue$, heightValue$)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01
      const bmi = Math.round(weight / (heightMeters * heightMeters))
      return bmi
    })
}

export function view(bmi$, weightVDom$, heightVDom$) {
  return xs.combine(bmi$, weightVDom$, heightVDom$)
    .map(([bmi, weightVDom, heightVDom]) =>
      renderCard([
        h1('.mdc-card__title .mdc-card__title--large', BMI.name)
      ], [
        weightVDom,
        heightVDom,
        p('BMI is ' + bmi)
      ], [])
    )
}

export default function BMI(sources) {
  const {
    weightVDom$, 
    weightValue$,
    heightVDom$, 
    heightValue$
  } = intent(sources)
  const bmi$ = model(weightValue$, heightValue$)
  const vdom$ = view(bmi$, weightVDom$, heightVDom$)

  return {
    DOM: vdom$
  }
}

