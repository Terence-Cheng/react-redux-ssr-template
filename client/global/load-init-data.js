
export default function loadInitData(pathname, callback) {
  const globalInfo = window.__GLOBAL__INFO__ // eslint-disable-line

  if (globalInfo.path === pathname) {
    // 服务端渲染的页面，无需再次请求相同的数据
    globalInfo.path = false
  } else if (typeof callback === 'function') {
    // 客户端渲染执行回调并返回
    return callback()
  }
  return new Promise(resolve => resolve(true))
}
