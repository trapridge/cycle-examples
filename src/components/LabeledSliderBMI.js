import xs from 'xstream'
import {div, h2, h3, section} from '@cycle/dom'
import isolate from '@cycle/isolate'

import LabeledSlider from './LabeledSlider'

export function intent(sources) {
  const weightProps$ = xs.of({
    label: 'Weight', unit: 'kg', min: 40, value: 70, max: 150, step: 0.5
  });
  const heightProps$ = xs.of({
    label: 'Height', unit: 'cm', min: 100, value: 170, max: 230, step: 1
    // label: 'Weight', unit: 'kg', min: 40, value: 70, max: 150
  });

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

// export function model(weightValue$) {
//   return weightValue$
// }
export function model(weightValue$, heightValue$) {
  return xs.combine(weightValue$, heightValue$)
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters))
      return bmi
    })
}

// export function view(weightVDom$) {
//   return xs.combine(weightVDom$)
//     .map(([weightVDom]) =>
//       div('.mdc-card .mdc-elevation--z0', [
//         section('.mdc-card__primary', [
//           h2('.mdc-card__title .mdc-card__title--large', 'LabeledSliderBMI')
//         ]),
//         section('.mdc-card__supporting-text', [
//           weightVDom,
//         ]),
//       ])
//     )
// }

export function view(bmi$, weightVDom$, heightVDom$) {
  return xs.combine(bmi$, weightVDom$, heightVDom$)
    .map(([bmi, weightVDom, heightVDom]) =>
      div('.mdc-card .mdc-elevation--z0', [
        section('.mdc-card__primary', [
          h2('.mdc-card__title .mdc-card__title--large', 'LabeledSliderBMI')
        ]),
        section('.mdc-card__supporting-text', [
          weightVDom,
          heightVDom,
          h3('BMI is ' + bmi)
        ]),
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
  // const bmi$ = model(weightValue$)
  const bmi$ = model(weightValue$, heightValue$)
  // const vdom$ = view(weightVDom$)
  const vdom$ = view(bmi$, weightVDom$, heightVDom$)

  return {
    DOM: vdom$
  }
}

