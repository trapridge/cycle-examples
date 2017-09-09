import {div, button, h3, h2, h4, a, section, makeDOMDriver, br} from '@cycle/dom'

export function intent(sources) {
  return {
    randomUserRequest$: sources.DOM.select('.get-random').events('click')
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
  
export function model(actions$) {
  return actions$
    .map(res => res.body)
    .startWith(null)
}

export function view(state$) {
  return state$
    .map(user =>
      div([
        div('.mdc-card .mdc-elevation--z0', [
          section('.mdc-card__primary', [
            h2('.mdc-card__title .mdc-card__title--large', 'GetRandomUser')
          ]),
          section('.mdc-card__supporting-text', [
            user === null ? null : div('.user-details .mdc-card .mdc-elevation--z1', [
              section('.mdc-card__primary', [
                h3('.mdc-card__title .mdc-card__title--large', user.name),
                h2('.mdc-card__title .mdc-card__title--small', user.email)
              ]),
              section('.mdc-card__supporting-text', [
                a('.user-website', {attrs: {href: user.website}}, user.website)
              ])
            ])
          ]),
          section('.mdc-card__actions', [
            button('.get-random .mdc-button .mdc-button--raised .mdc-button--accent', {attrs: {'data-mdc-auto-init': 'MDCRipple'}}, 'Get random user')
          ])
        ]),
      ])
    )
}

export default function GetRandomUser(sources) {
  const {randomUserRequest$, randomUserResponse$} = intent(sources)
  const vdom$= view(model(randomUserResponse$)) 

  return {
    DOM: vdom$,
    HTTP: randomUserRequest$
  }
}