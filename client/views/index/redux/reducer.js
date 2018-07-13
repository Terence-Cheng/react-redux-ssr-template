import { combineReducers } from 'redux'
import ACTION_TYPE from '../../../store/type'

const { TOPIC } = ACTION_TYPE

export default combineReducers({
  topicList(state = {
    error: false,
    loading: false,
    data: {},
  }, action) {
    switch (action.type) {
      case TOPIC.CHANGE_LIST:
        return action.data
      default:
        return state
    }
  },
})
