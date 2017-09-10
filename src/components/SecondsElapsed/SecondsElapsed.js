import xs from 'xstream'
import {p, h1} from '@cycle/dom'
import {renderCard} from '../../helpers/MdcDom'

export default function SecondsElapsed() {
  return {
    DOM: xs
      .periodic(1000)
      .map(i => 
        renderCard(
          [h1('.mdc-card__title .mdc-card__title--large', SecondsElapsed.name)], 
          [p(`${i} seconds elapsed`)], 
          []
        )
      )
  } 
}
