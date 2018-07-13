import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet-async'
import { connect } from 'react-redux'
import { getTopicList } from './redux/action'
import style from './css/index.scss'

@connect(
  state => ({
    topicList: state.topic.topicList
  }), {
    getTopicList
  }
)
export default class Index extends React.Component {
  static propTypes = {
    topicList: PropTypes.object,
    getTopicList: PropTypes.func,
    location: PropTypes.object,
  }

  static defaultProps = {
    topicList: {},
  }

  componentDidMount() {
    const { location } = this.props
    this.$loadInitData(location.pathname, this.getInitialData)
    // 服务端渲染完成后，避免客户端再次请求同样的数据；如果直接是客户端渲染，则需要加载数据
  }

  bootstrap() {
    return this.getInitialData()
  }

  getInitialData = () => {
    const { getTopicList } = this.props
    return getTopicList.call(this)
  }

  render() {
    const { topicList } = this.props
    return (
      <div>
        <Helmet>
          <title>cnode社区标题</title>
        </Helmet>
        <div className={style.test}>{JSON.stringify(topicList)}</div>
      </div>
    )
  }
}
