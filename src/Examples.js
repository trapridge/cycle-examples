import {div, h1} from '@cycle/dom'
import xs from 'xstream'

import SecondsElapsed from './components/SecondsElapsed'
import CheckBox from './components/CheckBox'
import GetRandomUser from './components/GetRandomUser'
import BMI from './components/BMI'
import LabeledSliderBMI from './components/LabeledSliderBMI'

export function Examples(sources) {
  const {DOM: elapsedDOM$} = SecondsElapsed(sources)
  const {DOM: checkBoxDOM$} = CheckBox(sources)
  const {
    DOM: getRandomUserDOM$, 
    HTTP: getRandomUserHTTP$
  } = GetRandomUser(sources)
  const {DOM: bmiDOM$} = BMI(sources)
  const {DOM: labeledSliderBmiDOM$} = LabeledSliderBMI(sources)

  const vDOM$ = xs
    .combine(elapsedDOM$, checkBoxDOM$, getRandomUserDOM$, bmiDOM$, labeledSliderBmiDOM$)
    .map(([elapsedDOM, testComponentDOM, getRandomUserDOM, bmiDOM, labeledSliderBmiDOM]) => 
      div([
        h1('Examples'),
        elapsedDOM,
        testComponentDOM,
        getRandomUserDOM,
        bmiDOM,
        labeledSliderBmiDOM
      ])
    )

  const http$ = xs.merge(getRandomUserHTTP$) 

  return {
    DOM: vDOM$,
    HTTP: http$
  }
}