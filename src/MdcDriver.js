/*global mdc*/

import xs from 'xstream'
import {adapt} from '@cycle/run/lib/adapt'

let DOMReady = false
const sliderInputProviderListeners = {}
const slidersWithInputEventListenerInDOM = {}

function isSliderInDOM(selector) {
  if (DOMReady && (document.querySelector(selector) !== null)) {
    let slider = document.querySelector(selector).MDCSlider
    return slider !== null
  }
  return false
}

function hasSliderWithListenerInDOM(selector) {
  return selector in slidersWithInputEventListenerInDOM
}

function getEventListener(listener) {
  return function(ev) {
    listener.next(ev.detail.value)
  }
}

function attemptToAddListener({selector, providerListener}) {
  if (isSliderInDOM(selector) && !hasSliderWithListenerInDOM(selector)) {
    let slider = document.querySelector(selector).MDCSlider
    const eventListener = getEventListener(providerListener)
    slider.listen('MDCSlider:input', eventListener) 
    slidersWithInputEventListenerInDOM[selector] = {slider, eventListener}
  }
}

function attemptToRemoveListener(selector) {
  if (!isSliderInDOM(selector) && hasSliderWithListenerInDOM(selector)) {
    const {slider, eventListener} = slidersWithInputEventListenerInDOM[selector]
    slider.unlisten('MDCSlider:input', eventListener)
    delete slidersWithInputEventListenerInDOM[selector]
  }
}

export function makeMDCDriver() {
  return function(sink$) {
    sink$.addListener({
      next: () => mdc.autoInit(document, () => {})
    })
    
    document.addEventListener('DOMContentLoaded', () => {
      DOMReady = true
    })
  
    setInterval(function updateListeners() {
      for (const selector in sliderInputProviderListeners) {
        attemptToRemoveListener(selector)
        attemptToAddListener({selector, providerListener: sliderInputProviderListeners[selector]})
      }
    }, 50)
  
    return {
      sliderInput: function sliderInput(selector) {
        return adapt(xs.create({
          start: function (providerListener) {
            sliderInputProviderListeners[selector] = providerListener
          },
          stop: function () {
            attemptToRemoveListener(selector)
          }
        }))
      }
    }
  }
  
}

