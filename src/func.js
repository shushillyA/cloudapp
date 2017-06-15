// import functions from './functions'
var Func = {}
Func.install = function (Vue, options) {
  Vue.prototype.$getURL = function (item) {
    return 'https://cloudappapi.test.xlhb.com/v1/' + item + '.api'
  }
  Vue.prototype.$sendParam = function (num) {
    return {
      params: {
        access_token: Vue.prototype.$getParam('token'),
        page: num
      }
    }
  }
  Vue.prototype.$invoke = function (method, params) {
    var platform
    if (window.EMULATION) {
      platform = window.EMULATION
    } else {
      platform = /android/i.test(navigator.userAgent) ? 'android' : (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ? 'ios' : '')
    }
    switch (platform) {
      case 'ios':
        // 调用方法实现JS与原生IOS ObjectC交互数据
        // 6.0
        window[method](JSON.stringify(params))
        break
      case 'android':
        // 调用方法实现JS与原生Android ObjectC交互数据
        var PROXY_OBJECT = 'android'
        // 6.0
        window[PROXY_OBJECT][method](JSON.stringify(params))
        break
      default:
        switch (method) {
          case 'alert':
            alert(params.message)
            break
          default:
            console.log({
              action: 'call',
              method: method,
              params: params
            })
        }
    }
  }
}
export default Func
