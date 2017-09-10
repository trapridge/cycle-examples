import {button, h1, h3, h2, a} from '@cycle/dom'

import {renderCard} from '../../helpers/MdcDom'

export function intent(sources) {
  return {
    randomUserRequest$: sources.DOM.select('.get-random').events('click')
      .map(() => {
        const randomNum = Math.round(Math.random() * 9) + 1
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
  
export function model(actions$) {
  return actions$
    .map(res => res.body)
    .startWith(null)
}

export function view(state$) {
  return state$
    .map(user =>
      renderCard(
        [h1('.mdc-card__title .mdc-card__title--large', RandomUser.name)],
        [user === null ? null : renderCard([
          h3('.mdc-card__title .mdc-card__title--large', user.name),
          h2('.mdc-card__title .mdc-card__title--small', user.email)
        ], [
          a('.user-website', {attrs: {href: `http://${user.website}`}}, user.website)
        ], [], {elevation: 1})],
        [button('.get-random .mdc-button .mdc-button--raised .mdc-button--accent', {attrs: {'data-mdc-auto-init': 'MDCRipple'}}, 'Get random user')]
      )
    )
}

export default function RandomUser(sources) {
  const {randomUserRequest$, randomUserResponse$} = intent(sources)
  const vdom$= view(model(randomUserResponse$)) 

  return {
    DOM: vdom$,
    HTTP: randomUserRequest$
  }
}