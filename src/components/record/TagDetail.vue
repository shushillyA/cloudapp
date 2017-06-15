<template>
  <div class='wrap'>
    <section id='title'></section>
    <div id='content'>
      <section class='shell' v-for='scale in labels'>
        <h2><span></span>{{scale.name}}</h2>
        <div id='explain'>{{scale.content}}</div>
      </section>
      <div class='empty'></div>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    & #title{
      width:100%;
      height:5rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
    & #content{
      margin-top:-3rem;
      & h2{
        font-size:1.8rem;
        color:#a5a6bb;
        line-height:4rem;
        & span{
          display:inline-block;
          width:1rem;
          height:1rem;
          background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
          box-shadow: 0 0 0.5rem #56dcf9;
          border-radius:0.5rem;
          margin-right:1rem;
        }
      }
      & #explain{
        font-size:1.8rem;
        color:#a5a6bb;
        line-height:2.5rem;
        padding-bottom: 1rem;
      }
      & .empty {
        height:4rem;
      }
    }
  }

</style>
<script>
// var BEHAVE_URL = 'https://cloudappapi.test.xlhb.com/v1/record/select-behavior.api?access_token='
import functions from '../../functions'
export default {
  name: 'tagdetail',
  created () {
    window.back = this.prev
    this.renderData()
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '行为说明' })
      this.$invoke('showButton', { text: 'GONE' })
    } catch (e) {

    }
  },
  data () {
    return {
      isShow: true,
      labels: []
    }
  },
  methods: {
                  // 渲染数据
    renderData: function () {
      // var url = 'https://cloudappapi.test.xlhb.com/v1/record/select-behavior.api?access_token='
      var self = this
        // 渲染数据
      // var token = functions.getParam('token')
      // url = url + token
      this.$http.jsonp(functions.getURL('record/select-behavior'), functions.sendParam()).then(function (obj) {
        console.log(obj, '收到的数据')
        var results = obj.data.data.behavior_labels
        try {
          for (var i = 0; i < results.length; i++) {
            for (var j = 0; j < results[i].labels.length; j++) {
              self.labels.push(results[i].labels[j])
            }
          }
          console.log(self.labels)
        } catch (e) {

        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
      // window.$.jsonp(url, function (obj) {
      //   console.log(obj)
      //   var results = obj.data.behavior_labels
      //   try {
      //     for (var i = 0; i < results.length; i++) {
      //       for (var j = 0; j < results[i].labels.length; j++) {
      //         self.labels.push(results[i].labels[j])
      //       }
      //     }
      //     console.log(self.labels)
      //   } catch (e) {

      //   }
      // })
    },
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
    }
  }
}
</script>
