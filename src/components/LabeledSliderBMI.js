import xs from 'xstream'
import {div, h2, h3} from '@cycle/dom'
import isolate from '@cycle/isolate'

import LabeledSlider from './LabeledSlider'

export function intent(sources) {
  const weightProps$ = xs.of({
    label: 'Weight', unit: 'kg', min: 40, value: 70, max: 150
  });
  const heightProps$ = xs.of({
    label: 'Height', unit: 'cm', min: 140, value: 170, max: 210
  });

  const weightSources = {DOM: sources.DOM, props: weightProps$}
  const heightSources = {DOM: sources.DOM, props: heightProps$}

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
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters))
      return bmi
    })
}

export function view(bmi$, weightVDom$, heightVDom$) {
  return xs.combine(bmi$, weightVDom$, heightVDom$)
    .map(([bmi, weightVDom, heightVDom]) =>
      div('.example', [
        h2('LabeledSliderBMI'),
        weightVDom,
        heightVDom,
        h3('BMI is ' + bmi)
      ])
    )
}

export default function LabeledSliderBMI(sources) {
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

