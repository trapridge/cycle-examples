import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'

import {table, td, tr, h1, h3, button} from '@cycle/dom'

import {renderCard} from '../../helpers/MdcDom'
import {runGame, emptyGame} from './TicTacToeGameLogic'
import './TicTacToe.css'

export function intent(sources) {
  const reset$ = sources.DOM.select('#play-again').events('click')
    .map(() => 'reset')
  const selections$ = sources.DOM.select('td').events('click')
    .map(ev => parseInt(ev.target.id))
  
  return {reset$, selections$}
}

export function model({reset$, selections$}) {
  return xs
    .merge(
      reset$, 
      selections$.compose(dropRepeats())
    )
    .fold(runGame, emptyGame())
}

function renderNoughtOrCross(char, haystack) {
  return function (needle) {
    return haystack.includes(needle) ? char : null
  }
}

export function view(state$) {
  return state$
    .map(({crosses, noughts, winner}) => {
      const x = renderNoughtOrCross('\u2573', crosses || [])
      const o = renderNoughtOrCross('\u25EF', noughts || [])
      return (
        renderCard([
          h1('.mdc-card__title .mdc-card__title--large', TicTacToe.name)
        ], [
          table('.tictactoe', [
            tr([
              td('#1.square', [x(1), o(1)]),
              td('#2.square.v', [x(2), o(2)]),
              td('#3.square', [x(3), o(3)])
            ]),
            tr([
              td('#4.square.h', [x(4), o(4)]),
              td('#5.square.v.h', [x(5), o(5)]),
              td('#6.square.h', [x(6), o(6)])
            ]),
            tr([
              td('#7.square', [x(7), o(7)]),
              td('#8.square.v', [x(8), o(8)]),
              td('#9.square', [x(9), o(9)])
            ])
          ]),  
          winner ? 
            h3(`${winner} wins`) : 
            null
        ], [
          winner ? 
            button('.mdc-button .mdc-button--raised .mdc-card__action', 
              {attrs: {'id': 'play-again', 'data-mdc-auto-init': 'MDCRipple'}}, 'Play again') : 
            null
        ])
      )  
    })
}

export default function TicTacToe(sources) {
  const vdom$ = view(model(intent(sources)))

  return {DOM: vdom$}
}