import xs from 'xstream';
import {div, input, h2, h3} from '@cycle/dom';

function intent(sources) {
  return {
    weight$: sources.DOM.select('.weight')
      .events('input')
      .map(ev => ev.target.value),
    height$: sources.DOM.select('.height')
      .events('input')
      .map(ev => ev.target.value)
  }
}

function model(actions) {
  const {weight$, height$} = actions
  return xs.combine(weight$.startWith(70), height$.startWith(170))
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return {weight, height, bmi};
    })
}

function view(state$) {
  return state$.map(({weight, height, bmi}) =>
    div([
      h2('BMI'),
      div([
        input('.weight', 
          {attrs: {type: 'range', min: 40, max: 140, value: weight}}),
        'Weight ' + weight + 'kg',
      ]),
      div([
        input('.height', 
          {attrs: {type: 'range', min: 140, max: 210, value: height}}),
        'Height ' + height + 'cm',
      ]),
      h3('BMI is ' + bmi)
    ])
  )
}

export function BMI(sources) {
  return {DOM: view(model(intent(sources)))}
}