<template>
  <div class="wrap">
    <section class='title'></section>
    <section class='content'>
      <section class='shell'>
        <router-link :to="{path: '/record/add/student/'}">
          <h2><span>学生</span><span>{{realname}}</span><img src='../../assets/row.png'></h2>
        </router-link>
      </section>
      <section class='shell'>
        <router-link :to="{path: '/record/add/behave/'}">
          <h2><span>异常表现</span><span>{{countBehave}}</span><img src='../../assets/row.png'></h2>
          <div class='remark'>{{behaveDetail}}</div>
        </router-link>
      </section>
      <section class='shell'>
        <router-link :to="{path: '/record/add/effect/'}">
          <h2><span>生活事件</span><span>{{countEffect}}</span><img src='../../assets/row.png'></h2>
          <div class='remark'>{{effectDetail}}</div>
        </router-link>
      </section>
    </section>
  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    & .title{
      width:100%;
      height:4rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
    & .content{
      margin-top:-2rem;
      margin-bottom:8rem;
      & section{
        position:relative;
      }
      & h2{
        overflow:hidden;
      }
      & img{
        width: 0.8rem;
        height: 0.8rem;
        float: right;
        position:absolute;
        top: 1.6rem;
        right: 1.6rem;
      }
      & section{
        & span:nth-child(1){
          float:left;
          font-size:1.8rem;
          color:#6c7079;
        }
        & span:nth-child(2){
          float:right;
          font-size:1.6rem;
          color:#2dd1f2;
          margin-right:2rem;
        }
      }
      & div{
        font-size:1.6rem;
        color:#a5a6bb;
        line-height:2rem;
        margin-top: 0.4rem;
      }
    }
  }
</style>
<script>
import functions from '../../functions'
// var params
export default{
  name: 'addrecord',
  data () {
    return {
      realname: '',
      countEffect: '',
      countBehave: '',
      behaveDetail: '',
      effectDetail: ''
    }
  },
  created () {
    window.back = this.prev
    window.clickButton = this.clickButton
    // params = window.localStorage.getItem('recordParams')
    // if (params) {
    //   params = JSON.parse(params)
    // } else {
    //   params = {
    //     id: '',
    //     realname: '',
    //     behaves: [],
    //     behaveDetail: '',
    //     effects: [],
    //     effectDetail: ''
    //   }
    //   window.localStorage.setItem('recordParams', JSON.stringify(params))
    // }
    // this.realname = params.realname || '请选择'
    // this.countBehave = params.behaves.length ? '已选' + params.behaves.length : '请选择'
    // this.countEffect = params.effects.length ? '已选' + params.effects.length : '请选择'
    // this.behaveDetail = params.behaveDetail
    // this.effectDetail = params.effectDetail
    this.realname = this.$store.state.record.realname || '请选择'
    this.countBehave = this.$store.state.record.behaves.length ? '已选' + this.$store.state.record.behaves.length : '请选择'
    this.countEffect = this.$store.state.record.effects.length ? '已选' + this.$store.state.record.effects.length : '请选择'
    this.behaveDetail = this.$store.state.record.behaveDetail
    this.effectDetail = this.$store.state.record.effectDetail
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '添加记录' })
      this.$invoke('showButton', { text: '保存' })
    } catch (e) {
    }
  },
  methods: {
          // 渲染数据
    // renderData: function () {
    //   // var self = this
    //   params = window.localStorage.getItem('recordParams')
    //   if (params) {
    //     params = JSON.parse(params)
    //   } else {
    //     params = {
    //       id: '',
    //       realname: '',
    //       behaves: [],
    //       behaveDetail: '',
    //       effects: [],
    //       effectDetail: ''
    //     }
    //   }
    //   // console.log(params)
    // },
    prev: function () {
      console.log('45641641646446')
      // window.localStorage.removeItem('recordParams')
      this.$store.commit('recordToInit')
      console.log(this.$store.state.record, '返回')
      this.$router.go(-1)
      console.log('go back')
      try {
        this.$invoke('toggleNavigation', { isShow: true })
        this.$invoke('setTitle', { title: '首页' })
      } catch (e) {
      }
    },
    clickButton: function () {
      console.log('保存成功了吗')
      var ADDDATA_URL = 'https://cloudappapi.test.xlhb.com/v1/record/add-data.api?access_token='
      var token = functions.getParam('token')
      var params = this.$store.state.record
      if (!params.id) {
        this.$invoke('showMessage', {message: '请选择学生'})
        return
      }
      if (params.behaveDetail.length + params.effectDetail.length + params.behaves.length + params.effects.length > 0) {
        var url = ADDDATA_URL + token + '&user_id=' + params.id + '&behavior_content=' + params.behaveDetail + '&element_content=' + params.effectDetail + '&behavior=' + params.behaves + '&element=' + params.effects
        console.log(url)
        var self = this
        window.$.jsonp(url, function (obj) {
          try {
            self.prev()
            window.$.invoke('showMessage', {code: '10000'})
            console.log('保存成功跳转吗')
          } catch (e) {
            window.$.invoke('showMessage', {code: '10001', message: '提交失败'})
          }
        }, function () {
          window.$.invoke('showMessage', { message: '网络请求失败' })
        })
        // this.$http.jsonp(functions.getURL(record/add-data),)
      } else {
        this.$invoke('showMessage', {message: '请选择记录的异常表现或生活事件'})
      }
    }
  }

}

</script>
