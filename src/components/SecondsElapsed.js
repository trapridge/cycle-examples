import {div, p, h2} from '@cycle/dom'
import xs from 'xstream'

export function SecondsElapsed(sources) {
  return {
    DOM: xs
      .periodic(1000)
      .map(i => 
        div([
          h2('SecondsElapsed'),
          p(`${i} seconds elapsed`)
        ])
      )
  } 
}
