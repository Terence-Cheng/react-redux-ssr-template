import React from 'react'
import {
  Route, Switch,
} from 'react-router-dom'

function Index() {
  return (
    <div>index</div>
  )
}

export default () => (
  <Switch>
    <Route path="/" exact component={Index} key="index" />

    {/* 此路由一定要放到最后 */}
    {/*<Route path="*" component={NotFound} key="not_found_404" />*/}
  </Switch>
)
