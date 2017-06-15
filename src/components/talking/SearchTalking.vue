<template>
  <div class='wrap'>
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="" v-on:click='search($event)'>
        <form v-on:submit='search($event)'>
          <input id='input' type="search" placeholder="搜索用户" ref='input1' @input="change($event)"
                 onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" autocomplete="off" v-model='input'>
        </form>
        <img id="cancel_img" src="../../assets/cancel.png" alt="" v-show='input.length > 0' v-on:click='clear'>
      </section>
    </div>
    <div class='searchTemp' v-if='tempShow'>
      <section class='shell' v-for='temp in temps' v-on:click='select(temp)'>
        <img src='../../assets/search_blue.png'>{{temp}}
      </section>
    </div>
    <div v-if='resultShow' id='noContent'>
      <img src='../../assets/logo_no.png'>
      <p>暂无内容</p>
    </div>
    <div id="pull-header" class="white"><section>刷新中...</section></div>
    <div class='content' v-on:refresh="refresh" v-on:append="append">
      <div v-for='item in items'>
        <router-link :to="{ name: 'talkingdetail', params: {access_token: item.access_token, user_id: item.user_id, name: item.name, age: item.age, class_name: item.class_name, role_name: item.role_name}}">
          <section class='shell detail' v-on:click='save'>
            <div class='type' v-if='item.role_name!=="家长"'>{{item.role_name}}</div>
            <div class='parent_type' v-if='item.role_name==="家长"'>{{item.role_name}}</div>
            <p class='name'>{{item.name}}</p>
            <p class='class'>{{item.class_name.fullName}}</p>
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
<style scoped>
  .wrap{
    & .search{
      height:10rem;
    }
    & .content{
      width:100%;
      height:100%;
      margin-top: 0.5rem;
      margin-bottom:8rem;
      position:relative;
      & .type,& .parent_type{
        float: left;
        width: 18%;
        height: 2rem;
        border-radius: 1rem;
        color: #ffffff;
        font-size: 1.4rem;
        text-align: center;
        line-height: 2rem;
        margin-top: 0.5rem;
      }
      & .type{
        background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
      }
      & .parent_type{
        background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#ff5cb4), to(#ff75a4));
      }
      & .name{
        float:left;
        font-size:1.6rem;
        color:#6c7079;
        margin:0 1rem;
        line-height:3rem;
      }
      & .class{
        float:left;
        font-size:1.5rem;
        color:#bdc0c7;
        line-height:3rem;
      }
    }
  }

</style>
<script>
import functions from '../../functions'
export default {
  name: 'searchtalkfeelings',
  data () {
    return {
      items: [],
      resultShow: false,
      input: '',
      tempShow: false,
      temps: [],
      loadingShow: false,
      touchRefresh: null,
      page: 1
    }
  },
  created () {
    console.log('跳转搜索')
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '倾诉' })
    } catch (e) {
    }
    this.$nextTick(function () { // 进入页面时input输入框聚焦
      document.getElementById('input').focus()
    })
    var state = this.$route.params.talkSign
    if (state === false) {
      this.items = []
    } else {
      var talkTemp = this.$store.state.talking.searchTalkingArr
      console.log(talkTemp)
      this.items = talkTemp
      this.input = this.$store.state.key
      console.log(this.items)
      this.$nextTick(function () {
        document.body.scrollTop = window.$.stationArr.pop()
        document.getElementById('input').blur()
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
        page: this.page,
        username: this.input
      }
      this.$http.jsonp(
        functions.getURL('usermateapp'),
        {
          params: sendData
        }).then(
          function (obj) {
            console.log(obj, '接受的数据')
            var results = obj.data.data
            this.$store.state.count = results.count
            this.$store.state.pageSize = results.page_size
            try {
              if (!append) {
                self.items = []
              }
              if (Array.isArray(results.list)) {
                if (results.list.length > 0) {
                  self.resultShow = false
                  for (var i = 0; i < results.list.length; i++) {
                    self.items.push(results.list[i])
                  }
                  if (self.items.length > 0) {
                    self.resultShow = false
                    self.loadingShow = false
                  }
                } else {
                  self.resultShow = true
                  self.loadingShow = false
                }
              }
              if (self.touchRefresh) {
                self.touchRefresh.recover()
              }
            } catch (e) {

            }
          }, function () {
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
    },
    searchData: function () {
      var self = this
      self.temps = []
      self.resultShow = false
      var token = functions.getParam('token')
      var sendData = {
        access_token: token,
        page: this.page,
        username: this.input
      }
      this.$http.jsonp(
        functions.getURL('usermateapp'),
        {
          params: sendData
        }).then(
          function (obj) {
            console.log(obj, '收到的数据')
            var results = obj.data.data
            try {
              if (Array.isArray(results.list)) {
                for (var k = 0; k < results.list.length; k++) {
                  if (results.list[k].name.indexOf(self.input) !== -1) {
                    console.log(results.list[k].name)
                    if (self.temps.indexOf(results.list[k].name) === -1) {
                      self.temps.push(results.list[k].name)
                    }
                  }
                }
              }
            } catch (e) {

            }
          })
    },
    select: function (temp) {
      this.input = temp
      this.tempShow = false
      this.renderData()
      this.$store.state.key = temp
    },
    refresh: function () {
      console.log('refresh')
      this.page = 1
      this.loadingShow = false
      this.renderData()
    },
    append: function () {
      if (this.page < Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        this.page++
        this.renderData(true)
      } else if (this.page === Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        window.$.invoke('showMessage', {message: '没有更多数据'})
        this.resultShow = false
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }
    },
    search: function (event) {
      this.loadingShow = true
      event.preventDefault()
      this.renderData()
      this.$nextTick(function () { // 搜索完成后input输入框失去焦点
        document.getElementById('input').blur()
      })
      this.tempShow = false
      this.$store.state.key = this.input
    },
    change: function (e) {
      this.items = []
      if (e.target.value) {
        this.tempShow = true
        this.searchData()
      } else {
        this.tempShow = false
      }
    },
    clear: function () {
      this.input = ''
      this.tempShow = false
      this.items = []
    },
    prev: function (event) {
      this.$nextTick(function () { // 进入搜索界面不搜索直接返回时input输入框失去焦点，收起软键盘
        document.getElementById('input').blur()
      })
      this.$router.go(-1)
      console.log('go back')
    },
    save: function () {
      window.$.stationArr.push(document.body.scrollTop)
      this.$store.state.talking.searchTalkingArr = this.items
    }
  }
}

</script>
