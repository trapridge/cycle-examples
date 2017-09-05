import {div, h1} from '@cycle/dom'
import xs from 'xstream'

import TicTacToe from './components/TicTacToe'
import SecondsElapsed from './components/SecondsElapsed'
import CheckBox from './components/CheckBox'
import GetRandomUser from './components/GetRandomUser'
import BMI from './components/BMI'
import LabeledSliderBMI from './components/LabeledSliderBMI'
import LabeledSliderCircle from './components/LabeledSliderCircle'

export function Examples(sources) {
  const {DOM: ticTacToeDOM$} = TicTacToe(sources)
  const {DOM: elapsedDOM$} = SecondsElapsed(sources)
  const {DOM: checkBoxDOM$} = CheckBox(sources)
  const {
    DOM: getRandomUserDOM$, 
    HTTP: getRandomUserHTTP$
  } = GetRandomUser(sources)
  const {DOM: bmiDOM$} = BMI(sources)
  const {DOM: labeledSliderBmiDOM$} = LabeledSliderBMI(sources)
  const {DOM: labeledSliderCircleDOM$} = LabeledSliderCircle(sources)

  const vDOM$ = xs
    .combine(
      ticTacToeDOM$,
      elapsedDOM$, 
      checkBoxDOM$, 
      getRandomUserDOM$, 
      bmiDOM$, 
      labeledSliderBmiDOM$, 
      labeledSliderCircleDOM$
    )
    .map(([
        ticTacToeDOM,
        elapsedDOM, 
        checkBoxDOM, 
        getRandomUserDOM, 
        bmiDOM, 
        labeledSliderBmiDOM, 
        labeledSliderCircleDOM]) => 
      div([
        h1('Examples'),
        ticTacToeDOM,
        labeledSliderCircleDOM,
        labeledSliderBmiDOM,
        bmiDOM,
        getRandomUserDOM,
        checkBoxDOM,
        elapsedDOM
      ])
    )

  const http$ = xs.merge(getRandomUserHTTP$) 

  return {
    DOM: vDOM$,
    HTTP: http$
  }
}