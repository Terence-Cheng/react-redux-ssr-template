import ACTION_TYPE from '../../../store/type'

const { TOPIC } = ACTION_TYPE

export const changeTopicList = data => ({
  type: TOPIC.CHANGE_LIST,
  data,
})

export const getTopicList = function () {
  return (dispatch) => {
    dispatch(changeTopicList({
      loading: true,
    }))
    return this.$axiosGet('topics', {
      mdrender: false,
      tab: 'ask',
      page: 1,
      limit: 20,
    }).then((resp) => {
      if (resp.success) {
        dispatch(changeTopicList({
          data: resp.data,
          error: false,
          loading: false,
        }))
      } else {
        dispatch(changeTopicList({
          data: [],
          error: true,
          loading: false,
        }))
      }
    })
  }
}
