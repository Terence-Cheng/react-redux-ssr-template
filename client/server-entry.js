import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import configureStore from './store/store'
import App from './views/App'

const store = configureStore()
export { store }

export default (store, routerContext, sheetsRegistry, jss, url, helmetContext) => (
  <Provider store={store}>
    <StaticRouter context={routerContext} location={url}>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </StaticRouter>
  </Provider>
)
