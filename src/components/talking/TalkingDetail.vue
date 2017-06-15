<template>
  <div class='wrap'>
    <div class='detail_top'></div>
    <section class='shell detail_content'>
      <img src='../../assets/logo.png'>
      <div class='person' v-for='item in items'>
        <h2>{{item.name}}<span v-show='isShow'>{{item.role_name}}</span></h2>
        <span class='person_age'>{{item.age}}岁</span>
        <span class='person_class'>{{item.class_name.fullName}}</span>
      </div>
      <div id="pull-header"><section>刷新中...</section></div>
      <div class='talk_time content' v-on:refresh="refresh" v-on:append="append">
        <section v-for='talk in talks'>
          <div>
            <p>起</p>
            <p>止</p>
          </div>
          <div>
            <p>{{talk.create_time}}</p>
            <p>{{talk.endtime}}</p>
          </div>
          <div>
            <p>通话时长</p>
            <p>{{talk.duration}}秒</p>
          </div>
        </section>
      </div> 
      <div id="pull-footer"><section>加载中...</section></div>
    </section>
  </div>
</template>
<style scoped>
  .wrap{
    & .detail_top{
      width: 100%;
      height: 11rem;
      text-align: center;
      padding: 5% 2% 4% 2%;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
      & .detail_content{
        width:92%;
        height:100%;
        margin: 0 4%;
        padding:4% 3%;
        background-color: #fff;
          border-radius: 1.8rem;
          box-shadow: 0 0 1.6rem #56dcf9;
          margin-top:-1.5rem;
          margin-bottom:8rem;
          & img{
            width: 8rem;
            height: 8rem;
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%,66%);
          }
          & .person{
            height:7rem;
            margin: 5rem auto 2rem;
            text-align:center;
            & h2{
              font-size:2rem;
              color:#6c7079;
              height:3rem;
              line-height:3rem;
              & span{
                display: inline-block;
                width: 5rem;
                height: 1.8rem;
                font-size: 1.2rem;
                color: #fff;
                background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#ff5cb4), to(#ff75a4));
                text-align: center;
                line-height: 1.8rem;
                border-radius: 0.9rem;
                margin: 0 0 0 0.4rem;
              }
            }
            & .person_age{
              font-size:2rem;
              color:#bdc0c7;
              line-height:4rem;
            }
            & .person_class{
              font-size:1.8rem;
              color:#bdc0c7;
              line-height:4rem;
              margin-left:2rem;
            }
          }
          & .talk_time{
            width:100%;
            height:auto;
            overflow:hidden;
            & section{
              height:6rem;
              overflow:hidden;
              margin-bottom:1rem;
              & div:nth-child(1){
                float:left;
                width:10%;
                & p:nth-child(1){
                    width: 2.4rem;
                    height: 2.4rem;
                    text-align: center;
                    line-height: 2.4rem;
                    border-radius: 1.2rem;
                    color: #fff;
                    background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
                    margin-bottom: 0.4rem;
                    margin-top: 0.2rem;
                    font-size: 1.5rem;
                }
                & p:nth-child(2){
                  width: 2.4rem;
                  height: 2.4rem;
                  text-align: center;
                  line-height: 2.4rem;
                  border-radius: 1.2rem;
                  color:#fff;
                  background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#ff5cb4), to(#ff75a4));
                  font-size: 1.5rem;
                }
              }
              & div:nth-child(2){
                float:left;
                width:60%;
                color:#bdc0c7;
                font-size:1.8rem;
                line-height:2.8rem;
                margin-left: 2%;
              }
              & div:nth-child(3){
                float:right;
                width:26%;
                text-align:right;
                font-size:1.5rem;
                line-height:2.4rem;
                & p:nth-child(1){
                  color:#bdc0c7;
                }
                & p:nth-child(2){
                  color:#3dbfff;
                }
              }
            }
          }
      }
  }
</style>
<script>
import functions from '../../functions'
export default {
  name: 'talkfeelingsdetail',
  data () {
    return {
      items: [],
      talks: [],
      isShow: false,
      touchRefresh: null,
      page: 1
    }
  },
  created () {
    console.log('跳转')
    this.renderData()
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '倾诉详情' })
    } catch (e) {
    }
    var params = this.$route.params
    this.items.push(params)
  },
  mounted () {
    this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
  },
  methods: {
                // 渲染数据
    renderData: function (append = false) {
      var self = this
      var token = functions.getParam('token')
      var params = this.$route.params
      console.log(params)
      if (this.$route.params.role_name === '家长') {
        self.isShow = true
      } else {
        self.isShow = false
      }
      var sendData = {
        access_token: token,
        page: this.page,
        meta_token: params.access_token,
        user_id: params.user_id
      }
      this.$http.jsonp(
        functions.getURL('usermateapp/detail'),
        {
          params: sendData
        }).then(
          function (obj) {
            console.log(obj, '收到的数据')
            try {
              if (!append) {
                self.talks = []
              }
              var results = obj.data.data
              this.$store.state.count = results.count
              this.$store.state.pageSize = results.page_size
              for (var i = 0; i < results.list.length; i++) {
                console.log(results.list[i])
                results.list[i].create_time = functions.getWeekDay(results.list[i].accesstime * 1000).substr(0, 19)
                results.list[i].endtime = functions.getWeekDay(results.list[i].endtime * 1000).substr(0, 19)
                self.talks.push(results.list[i])
              }
              console.log(self.talks)
            } catch (e) {

            }
            if (self.touchRefresh) {
              self.touchRefresh.recover()
            }
          }, function () {
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
    },
    refresh: function () {
      console.log('refresh')
      this.page = 1
      this.renderData()
    },
    append: function () {
      console.log('append')
      if (this.page < Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        this.page++
        this.renderData(true)
      } else if (this.page === Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        window.$.invoke('showMessage', {message: '没有更多数据'})
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }
    },
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
    }
  }
}
</script>
