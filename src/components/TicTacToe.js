import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import sampleCombine from 'xstream/extra/sampleCombine'

import {div, table, td, tr, h2, h3, button} from '@cycle/dom'

import {runGame, emptyGame} from './TicTacToeGameLogic'

export function intent(sources) {
  const reset$ = sources.DOM.select('.play').events('click')
    .map(ev => 'reset')

  const selections$ = sources.DOM.select('td').events('click')
    .map(ev => parseInt(ev.target.id))
    .compose(dropRepeats())
  
  return xs.merge(reset$, selections$)
}
  
export function model(actions$) {
  return actions$
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
      return div('.example', [
        h2('TicTacToe'),
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
        winner ? div([h3(`${winner} wins`), button('.play', 'Play again')]) : null,
      ])
    })
}

export default function TicTacToe(sources) {
  const vdom$ = view(model(intent(sources)))
  
  return {DOM: vdom$}
}