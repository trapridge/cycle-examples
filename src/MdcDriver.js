import xs from 'xstream'

export default function mdcDriver(sink$) {
  sink$.addListener({
    next: () => mdc.autoInit(document, () => {})
  })
  
  let domReady = false
  document.addEventListener('DOMContentLoaded', () => {
    domReady = true
  })
  
  const sliderInputListeners = {}
  const slidersWithListenerInDom = {}
  
  setInterval(function updateListeners() {
    for (const selector in sliderInputListeners) {
      attemptToRemoveListener(selector)
      attemptToAddListener({selector, listener: sliderInputListeners[selector]})
    }
  }, 50)

  function isSliderInDOM(selector) {
    if (domReady && (document.querySelector(selector) !== null)) {
      let slider = document.querySelector(selector).MDCSlider
      return slider !== null
    }
    return false
  }

  function hasSliderWithListenerInDom(selector) {
    return selector in slidersWithListenerInDom
  }

  function getListener(listener) {
    return function(ev) {
      listener.next(ev.detail.value)
    }
  }

  function attemptToAddListener({selector, listener}) {
    if (isSliderInDOM(selector) && !hasSliderWithListenerInDom(selector)) {
      let slider = document.querySelector(selector).MDCSlider
      const fn = getListener(listener)
      slider.listen('MDCSlider:input', fn) 
      slidersWithListenerInDom[selector] = {slider, fn}
    }
  }

  function attemptToRemoveListener(selector) {
    if (!isSliderInDOM(selector) && hasSliderWithListenerInDom(selector)) {
      const {slider, fn} = slidersWithListenerInDom[selector]
      slider.unlisten('MDCSlider:input', fn)
      delete slidersWithListenerInDom[selector]
    }
  }

  return {
    sliderChange: function sliderChange(selector) {
      const producer = {
        start: function (listener) {
          sliderInputListeners[selector] = listener
        },
        stop: function () {
          attemptToRemoveListener(selector)
        },
        id: 0,
      }
      return xs.create(producer)
    }
  }
}
