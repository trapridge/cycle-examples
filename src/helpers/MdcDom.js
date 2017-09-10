import {div, section, input, svg, span, label as lbl} from '@cycle/dom'

export function renderCard(primary, supportingText, actions, config) {
  config = {elevation: 0, ...config}
  return (
    div(`.mdc-card .mdc-elevation--z${config.elevation}`, [
      section('.mdc-card__primary', primary),
      section('.mdc-card__supporting-text', supportingText),
      section('.mdc-card__actions', actions)
    ])
  ) 
}

export function renderCheckBox(checked) {
  return (
    div('.mdc-checkbox', {attrs: {'id': 'cbox2', 'data-mdc-auto-init': 'MDCCheckbox'}}, [
      input(
        '.mdc-checkbox__native-control', 
        {attrs: {'type': 'checkbox', 'id': 'cbox', 'checked': checked}}
      ),
      div('.mdc-checkbox__background', [
        svg(
          '.mdc-checkbox__checkmark', 
          {attrs: {'viewBox': '0 0 24 24'}}, [
            svg.path(
              '.mdc-checkbox__checkmark__path', 
              {attrs: {
                'fill': 'none', 
                'stroke': 'white', 
                'd': 'M1.73,12.91 8.1,19.28 22.79,4.59'
              }}
            )
          ]),
        div('.mdc-checkbox__mixedmark')
      ])
    ])
  )
}

export function renderSlider(minVal, maxVal, nowVal, label, unit, step, id) {
  return (
    div([
      lbl({attrs: {for: id}}, `${label}: ${nowVal} ${unit}`),
      div(`.mdc-slider`, {
        attrs: {
          'data-mdc-auto-init': 'MDCSlider',    
          'tabindex': id, 
          'role': 'slider', 
          'aria-valuemin': minVal, 
          'aria-valuemax': maxVal, 
          'aria-valuenow': nowVal,
          'aria-label': label,
          'id': id,
          'data-step': step
        }
      }, [
        div('.mdc-slider__track-container', [
          div('.mdc-slider__track')
        ]),
        div('.mdc-slider__thumb-container', [
          div('.mdc-slider__pin', [
            span('.mdc-slider__pin-value-marker')
          ]),
          svg('.mdc-slider__thumb', {
            attrs: {
              'width': '21',
              'height': '21'
            }
          }, [
            svg.circle({
              attrs: {
                cx: '10.5',
                cy: '10.5',
                r: '7.875'
              }
            })
          ]),
          div('.mdc-slider__focus-ring')
        ])
      ])
    ])
  )
}
