import xs from 'xstream'
import {div, p, section, h2} from '@cycle/dom'

export default function SecondsElapsed(sources) {
  return {
    DOM: xs
      .periodic(1000)
      .map(i => 
        div('.mdc-card .mdc-elevation--z0', [
          section('.mdc-card__primary', [
            h2('.mdc-card__title .mdc-card__title--large', 'SecondsElapsed')
          ]),
          section('.mdc-card__supporting-text', [
            p(`${i} seconds elapsed`)
          ]),
        ])
      )
  } 
}
