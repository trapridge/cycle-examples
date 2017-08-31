import xs from 'xstream'
import {div, p, h2} from '@cycle/dom'

export default function SecondsElapsed(sources) {
  return {
    DOM: xs
      .periodic(1000)
      .map(i => 
        div('.example', [
          h2('SecondsElapsed'),
          p(`${i} seconds elapsed`)
        ])
      )
  } 
}
