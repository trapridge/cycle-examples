import xs from 'xstream';
import {div, button, h3, h2, h4, a, makeDOMDriver} from '@cycle/dom';

function intent(sources) {
  return {
    randomUserRequest$: sources.DOM.select('.get-random')
      .events('click')
      .map(() => {
        const randomNum = Math.round(Math.random() * 9) + 1;
        return {
          url: 'https://jsonplaceholder.typicode.com/users/' + String(randomNum),
          category: 'users',
          method: 'GET'
        }
      }),
    randomUserResponse$: sources.HTTP.select('users')
      .flatten()
    }
  }
  
  function model(actions$) {
    return actions$
    .map(res => res.body)
    .startWith(null)
}

function view(state$) {
  return state$
    .map(user =>
      div('.users', [
        h2('GetRandomUser'),
        button('.get-random', 'Get random user'),
        user === null ? null : div('.user-details', [
          h3('.user-name', user.name),
          h4('.user-email', user.email),
          a('.user-website', {attrs: {href: user.website}}, user.website)
        ])
      ])
    )
}

export function GetRandomUser(sources) {
  const {randomUserRequest$, randomUserResponse$} = intent(sources)
  const vdom$= view(model(randomUserResponse$)) 

  return {
    DOM: vdom$,
    HTTP: randomUserRequest$
  }
}