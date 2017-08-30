import xs from 'xstream';
import {div, h2, p} from '@cycle/dom';

export function LabeledSliderBMI(sources) {
  return {
    DOM: xs.of(
      div([
        h2('LabeledSliderBMI'),
        p('TODO')
      ])
    )
  }
}