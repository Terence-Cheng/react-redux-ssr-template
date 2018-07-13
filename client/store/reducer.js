import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import topic from '../views/index/redux/reducer'

export default combineReducers({
  routing: routerReducer,
  topic,
})
