import xs from 'xstream';
import {div, input, h2, h3, section} from '@cycle/dom';

export function intent(sources) {
  return {
    weight$: sources.DOM.select('.weight')
      .events('input')
      .map(ev => ev.target.value),
    height$: sources.DOM.select('.height')
      .events('input')
      .map(ev => ev.target.value)
  }
}

export function model(actions) {
  const {weight$, height$} = actions
  return xs.combine(weight$.startWith(70), height$.startWith(170))
    .map(([weight, height]) => {
      const heightMeters = height * 0.01;
      const bmi = Math.round(weight / (heightMeters * heightMeters));
      return {weight, height, bmi};
    })
}

export function view(state$) {
  return state$.map(({weight, height, bmi}) =>
    div('.mdc-card .mdc-elevation--z0', [
      section('.mdc-card__primary', [
        h2('.mdc-card__title .mdc-card__title--large', 'BMI')
      ]),
      section('.mdc-card__supporting-text', [
        div([
          input('.weight', {attrs: {type: 'range', min: 40, max: 140, value: weight}}),
          'Weight ' + weight + 'kg'
        ]),
        div([
          input('.height', {attrs: {type: 'range', min: 140, max: 210, value: height}}),
          'Height ' + height + 'cm'
        ]),
        h3('BMI is ' + bmi)
      ]),
    ])
  )
}

export default function BMI(sources) {
  return {DOM: view(model(intent(sources)))}
}