import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import { HelmetProvider } from 'react-helmet-async'

import App from './views/App'
import configureStore from './store/store'

const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line

const store = configureStore(initialState)

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <Component />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
  root,
)
}

render(App)

if (module.hot) {
  module.hot.accept('./store/reducer.js', () => { // 侦听reducers文件
    console.log('reducer changed')
    import('./store/reducer.js').then(({ default: nextRootReducer }) => {
      store.replaceReducer(nextRootReducer)
    })
  })

  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default // eslint-disable-line
    render(NextApp)
  })
}
