const axios = require('axios')

const baseUrl = 'http://cnodejs.org/api/v1'

module.exports = function (req, res) {
  console.log(11112222233333)
  console.log(req.headers)
  const {
    path, method, query, body: reqBody
  } = req
  axios(`${baseUrl}${path}`, {
    method,
    params: query,
    data: reqBody,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if (resp.status === 200) {
      res.send(resp.data)
    } else {
      res.status(resp.status).send(resp.data)
    }
  }).catch(err => {
    if (err.response) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send({
        success: false,
        msg: '未知错误'
      })
    }
  })
}
