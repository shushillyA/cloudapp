<template>
  <div class='wrap'>
    <section  class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <router-link :to="{ name: 'searchtalking', params: {talkSign: false}}">
          <input id='input' type="text" placeholder="搜索用户" ref = 'input1' @input="change($event)">
        </router-link>
      </section>
    </section>
    <div id="pull-header" class="white"><section>刷新中...</section></div>
    <div id='noContent' v-if='textShow'>
        <img src='../../assets/logo_no.png'>
        <p>暂无内容</p>
      </div>
    <div class='content' v-on:refresh="refresh" v-on:append="append">
      <div v-for='item in items' >
        <router-link :to="{ name: 'talkingdetail', params: {access_token: item.access_token, user_id: item.user_id, name: item.name, age: item.age, class_name: item.class_name, role_name: item.role_name}}">
          <section class='shell' v-on:click='getScroll($event)'>
            <div class='other_type' v-if="item.role_name==='学生'">{{item.role_name}}</div>
            <div class='parent_type' v-if="item.role_name==='家长'">{{item.role_name}}</div>
            <div class='other_type' v-if="item.role_name==='班主任'">{{item.role_name}}</div>
            <div class='other_type' v-if="item.role_name==='心理老师'">{{item.role_name}}</div>
            <div class='other_type' v-if="item.role_name==='教职工'">{{item.role_name}}</div>
            <div class='other_type' v-if="item.role_name==='校长'">{{item.role_name}}</div>
            <div class='other_type' v-if="item.role_name==='教育局'">{{item.role_name}}</div>
            <div class='other_type' v-if="item.role_name==='学科老师'">{{item.role_name}}</div>
            <div class='person'>
              <p>{{item.name}}</p>
              <p>{{item.class_name.fullName}}</p>
              <p v-if='item.call_num!==0'>{{item.accesstime}}</p>
            </div>
            <div class='talk'>
              <p>倾诉次数{{item.call_num}}次</p>
              <p v-if='item.call_num!==0'>{{item.duration}}秒</p>
            </div>
          </section>
        </router-link>
      </div>
    </div>
    <div class='loading' v-if='loadingShow'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
    <div id="pull-footer"><section>加载中...</section></div>
  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    & .search{
      height:10rem;
    }
    & .content{
      width:100%;
      height:100%;
      position:relative;
      margin-top: 0.5rem;
      & .other_type,& .parent_type{
        float: left;
        width: 18%;
        height: 2rem;
        border-radius: 2rem;
        color: #ffffff;
        font-size: 1.4rem;
        text-align: center;
        line-height: 2rem;
        margin-top:0.5rem;
      }
      & .other_type{
        background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#38b8ff), to(#02d3ff));
      }
      & .parent_type{
        background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#ff5cb4), to(#ff75a4));
      }
      & .person{
        float:left;
        width:48%;
        margin-left:2%;
        & p:nth-child(1){
          float:left;
          font-size:1.6rem;
          color:#6c7079;
          margin-right:1rem;
          width: 40%;
          height: 3rem;
          overflow: hidden;
          line-height: 3rem;
        }
        & p:nth-child(2){
          float: left;
          font-size: 1.6rem;
          color: #bdc0c7;
          line-height: 3rem;
          width: 50%;
          height: 3rem;
          overflow: hidden;
        }
        & p:nth-child(3) {
          font-size:1.5rem;
          color:#bdc0c7;
          float:left;
          width: 100%;
          line-height: 2rem;
        }
      }
      & .talk{
        float:right;
        text-align:right;
        line-height:2.5rem;
        & p:nth-child(1) {
          font-size:1.6rem;
          color:#3dbfff;
          line-height: 3rem;
        }
        & p:nth-child(2) {
          font-size:1.5rem;
          color:#bdc0c7;
          line-height: 2rem;
        }
      }
    }
  }

</style>
<script>
import functions from '../../functions'
export default {
  name: 'talkfeelings',
  data () {
    return {
      items: [],
      textShow: false,
      loadingShow: true,
      touchRefresh: null,
      page: 1
    }
  },
  created () {
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '倾诉' })
    } catch (e) {
    }
    if (window.$.stationArr.length === 0) {
      this.page = 1
      this.renderData()
    } else {
      this.loadingShow = false
      this.items = this.$store.state.talking.talkingArr
      this.$nextTick(function () {
        document.body.scrollTop = window.$.stationArr.pop()
      })
    }
  },
  mounted () {
    this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
  },
  methods: {
              // 渲染数据
    renderData: function (append = false) {
      var self = this
      var token = functions.getParam('token')
      var sendData = {
        access_token: token,
        page: this.page
      }
      this.$http.jsonp(
        functions.getURL('usermateapp'),
        {
          params: sendData
        }).then(
          function (obj) {
            console.log(obj, '收到的数据')
            var results = obj.data.data
            this.$store.state.count = results.count
            this.$store.state.pageSize = results.page_size
            try {
              if (!append) {
                self.items = []
                // storage = []
              }
              if (Array.isArray(results.list)) {
                for (var i = 0; i < results.list.length; i++) {
                  results.list[i].accesstime = functions.getWeekDay(results.list[i].accesstime * 1000).substr(0, 19)
                  self.items.push(results.list[i])
                }
              }
              if (self.items.length === 0) {
                self.textShow = true
              } else {
                self.textShow = false
              }
              self.loadingShow = false
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
      this.loadingShow = false
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
    getScroll: function () {
      window.$.stationArr.push(document.body.scrollTop)
      this.$store.state.talking.talkingArr = this.items
    },
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
      try {
        window.$.invoke('toggleNavigation', { isShow: true })
        window.$.invoke('setTitle', { title: '首页' })
      } catch (e) {

      }
    }
  }
}
</script>
