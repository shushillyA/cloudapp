exports.getLocalTime = function (ns) {
  /*
   * nS:为传进来的时间戳
   * type:时间显示模式.若传入12则为12小时制,不传入则为24小时制
   */
  // 年月日时分秒
  var Y, M, D, H, I, S
  // 月日时分秒为单位时前面补零
  function fillZero (v) {
    if (v < 10) {
      v = '0' + v
    }
    return v
  }

  var d = new Date(parseInt(ns / 1000) * 1000)
  Y = d.getFullYear()
  M = fillZero(d.getMonth() + 1)
  D = fillZero(d.getDate())
  H = fillZero(d.getHours())
  I = fillZero(d.getMinutes())
  S = fillZero(d.getSeconds())
  var localTime = Y + '.' + M + '.' + D + ' ' + H + ':' + I + ':' + S
  return localTime
}

var params = null
var getParams = function () {
  if (params !== null) {
    return params
  }
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_abab67e41a78e6ec64a15f45760241ef' // teacher010
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_a530760217c46179cb9cdcc1b78f124b' // xlhbuser31 学生
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_40f6b6201c717d531763207476568344' // sunny01 心理老师
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_4a710f185b98dad71b52c1ea76dae74a' // nail002班主任
  // var href = 'https://cloudappapi.test.xlhb.com/v1/homepage.api?token=sess_21fe20e343e5c84396f17e43cdc9943e' // chuerlaoshi01班主任  1234567a
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_e6e5e0dd4132d13083b2da19d7b64707' // chuyilaoshi01班主任  1234567a
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_76a50a42951ffc72382a929db3beb068&role=PSYCHOLOGY_TEACHER' // testone 心理老师
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_5d1930a34c47553e4c82430f212f6d89&role=EDUCATION_BOARD' // 市教育局
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_b61f54ba28f2dac78c3a75f1264cd317&role=EDUCATION_BOARD' // 区教育局
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=t6b1416f8493996414a51d9592f8030d&role=PSYCHOLOGY_TEACHER' // testtwo 心理老师
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_612b2f3f62f00f3dd8cc2173cbfaf091' // mmm001 家长 bbbb8888
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_4657868c3dfd8a61afdfe59ad8202a77' // jiahaoba 家长
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_540a767a3ca16b5ab57d34306a6d9ddb' // nail010 教职工
  // var href = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?token=sess_f667a25e7543632011bd20492252a6ba' // jiahao01  学生
  var href = window.location.href
  params = {}
  if (href) {
    var queryString = href.toString().match(/\?([^#]+)/)
    if (queryString) {
      var parts = queryString[1].split('&')
      for (var i = 0; i < parts.length; ++i) {
        var kv = parts[i].split('=')
        var k = window.decodeURIComponent(kv[0])
        if (k) {
          params[k] = window.decodeURIComponent(kv[1])
        }
      }
    }
  }
  return params
}

var getParam = function (name) {
  getParams()
  if (typeof params[name] !== 'undefined') {
    return params[name]
  }
  return null
}
var getURL = function (item) {
  return 'https://cloudappapi.test.xlhb.com/v1/' + item + '.api'
}
var sendParam = function (obj) {
  var params = { access_token: getParam('token') }
  for (var k in obj) {
    params[k] = obj[k]
  }
  return { params }
}
var orgId = null

exports.orgId = orgId
exports.getParams = getParams
exports.getParam = getParam
exports.getURL = getURL
exports.sendParam = sendParam

exports.getWeekDay = function (ns) {
  var date = new Date()
  var week
  // 年月日时分秒
  var Y, M, D, H, I, S
  // 月日时分秒为单位时前面补零
  function fillZero (v) {
    if (v < 10) {
      v = '0' + v
    }
    return v
  }
  var d = new Date(parseInt(ns / 1000) * 1000)
  Y = d.getFullYear()
  M = fillZero(d.getMonth() + 1)
  D = fillZero(d.getDate())
  H = fillZero(d.getHours())
  I = fillZero(d.getMinutes())
  S = fillZero(d.getSeconds())
  switch (date.getDay()) {
    case 0:
      week = '星期天'
      break
    case 1:
      week = '星期一'
      break
    case 2:
      week = '星期二'
      break
    case 3:
      week = '星期三'
      break
    case 4:
      week = '星期四'
      break
    case 5:
      week = '星期五'
      break
    case 6:
      week = '星期六'
      break
  }
  var localTime = Y + '-' + M + '-' + D + ' ' + H + ':' + I + ':' + S + ' ' + week
  return localTime
}
exports.preventZoom = function (e) {
  var t2 = e.timeStamp
  var t1 = e.currentTarget.dataset.lastTouch || t2
  var dt = t2 - t1
  var fingers = e.touches.length
  e.currentTarget.dataset.lastTouch = t2
  if (!dt || dt > 500 || fingers > 1) return // not double-tap
  e.preventDefault()
  e.target.click()
}

exports.getLoadTime = function () {
  // var starttime = new Date()
  // var endtime = ''
  var token = getParam('token')
  var role = getParam('role')
  console.log(role, '角色')
  if (role !== 'EDUCATION_BOARD') {
    window.$.jsonp('https://cloudappapi.test.xlhb.com/v1/homepage.api?access_token=' + token, function (obj) {
      window.$.invoke('showMessage', { code: obj.code, message: obj.msg })
      // endtime = new Date()
      // var interval = endtime.getTime() - starttime.getTime()
      // console.log(interval, '加载时长')
      // if (interval > 5000) {
      //   // window.$.flag = true
      //   window.$.invoke('showMessage', { message: '网络不给力over' })
      // }
    })
  } else if (role === 'EDUCATION_BOARD') {
    window.$.jsonp('https://cloudappapi.test.xlhb.com/v1/user/user-info.api?access_token=' + token, function (obj) {
      window.$.invoke('showMessage', { code: obj.code, message: obj.msg })
      // endtime = new Date()
      // var interval = endtime.getTime() - starttime.getTime()
      // console.log(interval, '加载时长')
      // if (interval > 5000) {
      //   // window.$.flag = true
      //   // window.$.invoke('showMessage', { message: '网络不给力over' })
      // }
    })
  }
}
