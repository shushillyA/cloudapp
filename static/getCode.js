// 获取token请求接口获得code值  为409时被踢传给原生跳到登录界面
(function () {
  var params = null
  var getParams = function () {
    if (params !== null) {
      return params
    }
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
    return 'https://cloud-app-api.dev.xlhb.com/v1/' + item + '.api'
  }

  var timer = null
  timer = window.setInterval(function () {
    var token = getParam('token')
    var role = getParam('role')
    if (role === "EDUCATION_BOARD") {
      // 'v1/edu-homepage.api?access_token='
      window.$.jsonp(`${getURL('edu-homepage')}?access_token=${token}`, function (obj) {
        if (obj.code == 409) {
          console.log(obj.code)
          window.$.invoke('showMessage', { code: obj.code, message: obj.msg })
          // window.$.invoke('showMessage',{message: '您的账号在异地登陆'})
          clearInterval(timer)
        }
      })
    } else if (role !== "EDUCATION_BOARD") {
      // 'v1/homepage.api?access_token='
      window.$.jsonp(`${getURL('homepage')}?access_token=${token}`, function (obj) {
        if (obj.code == 409) {
          console.log(obj.code)
          window.$.invoke('showMessage', { code: obj.code, message: obj.msg })
          // window.$.invoke('showMessage',{message: '您的账号在异地登陆'})
          clearInterval(timer)
        }
      })
    }
  }, 2000)
})()
