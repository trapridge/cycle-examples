import xs from 'xstream';
import {div, table, td, tr, h2, a, span} from '@cycle/dom';

const winners$ = xs.from([
  [1, 2, 3], [4, 5, 6], [7, 8, 9],  // horizontal
  [1, 4, 7], [2, 5, 8], [3, 6, 9],  // vertical
  [1, 5, 9], [7, 5, 3]  // diagonal
])
  // add reversions
  .map(winner => xs.from([winner, winner.slice().reverse()]))
  .flatten()
  .debug()

export function intent(sources) {
  winners$.addListener({
    next: () => {}
  })

  const clicks$ = sources.DOM.select('td').events('click')
    .map(ev => ev.target.id)
    .startWith(null)
    
    return clicks$
    // return winners$
  }
  
  export function model(actions$) {
    return actions$
    .fold((acc, val) => acc.includes(val) ? acc : [...acc, val], [])
    .drop(1)
}

function x(crosses, position) {
  return crosses.includes(position) ? '╳' : null
}

function renderO() {
  return div({style: {

  }})
}

export function view(state$) {
  return state$.map((crosses) => div('.example', [
    h2('TicTacToe'),
    table('.tictactoe', [
      tr([
        td('#1.square', [x(crosses, "1")]),
        td('#2.square.v', [x(crosses, "2")]),
        td('#3.square', [x(crosses, "3")])
      ]),
      tr([
        td('#4.square.h', [x(crosses, "4")]),
        td('#5.square.v.h', [x(crosses, "5")]),
        td('#6.square.h', [x(crosses, "6")])
      ]),
      tr([
        td('#7.square', [x(crosses, "7")]),
        td('#8.square.v', [x(crosses, "8")]),
        td('#9.square', [x(crosses, "9")])
      ])
    ])
  ]))
}

export default function TicTacToe(sources) {
  

  const vdom$ = view(model(intent(sources)))
  
  return {DOM: vdom$}
}