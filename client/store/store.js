import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'

export default function configureStore(initialState) {
  if (initialState) {
    if (window.devToolsExtension && process.env.NODE_ENV !== 'production') {
      return createStore(
        reducer, initialState, compose(applyMiddleware(thunk), window.devToolsExtension()),
      )
    }
    return createStore(reducer, initialState, compose(applyMiddleware(thunk)))
  }
  /*if (window.devToolsExtension && process.env.NODE_ENV !== 'production') {
    return createStore(
      reducer, compose(applyMiddleware(thunk), window.devToolsExtension()),
    )
  }*/
  return createStore(reducer, compose(applyMiddleware(thunk)))
}
