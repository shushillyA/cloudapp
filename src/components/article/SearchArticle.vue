<template>
  <div class='wrap'>
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="" v-on:click='search($event)'>
        <form action='' v-on:submit='search($event)'>
          <input id='input' type="search" placeholder="搜索" ref='input1' @input="change($event)" onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')"
            autocomplete="off" v-model='input'>
        </form>
        <img id="cancel_img" src="../../assets/cancel.png" alt="" v-show='input.length > 0' v-on:click='clear($event)'>
      </section>
    </div>
    <div class='searchTemp' v-if='tempShow'>
      <section class='shell' v-for='temp in temps' v-on:click='select(temp)'>
        <img src='../../assets/search_blue.png'>
        <p>{{temp}}</p>
      </section>
    </div>
    <div v-if='resultShow' id='noContent'>
      <img src='../../assets/logo_no.png'>
      <p>暂无内容</p>
    </div>
    <div id="pull-header" class="white">
      <section>刷新中...</section>
    </div>
    <div class='content' v-on:refresh="refresh" v-on:append="append">     
        <section class='shell' v-for='item in items' v-on:click='getScroll(item)'>
            <span></span>
            <p>{{item.title}}</p>
        </section>
    </div>
    <div class='loading' v-if='loadingShow'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
    <div id="pull-footer">
      <section>加载中...</section>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .content {
    margin-top: 0.8rem;
    & span {
      display: inline-block;
      width: 1.2rem;
      height: 1.2rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#2ca7ec), to(#1cd7ff));
      box-shadow: 0 0 0.5rem #56dcf9;
      border-radius: 0.5rem;
      margin-right: 1rem;
      float: left;
      margin-top: 0.9rem;
    }
    & p {
      font-size: 1.6rem;
      color: #515974;
      width: 90%;
      height: 3rem;
      line-height: 3rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  
  .searchTemp{
    & p{
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
<script>
  import functions from '../../functions'
  export default {
    name: 'searchsecret',
    data () {
      return {
        input: '',
        items: [],
        temps: [],
        tempShow: false,
        resultShow: false,
        loadingShow: false,
        page: 1
      }
    },
    created () {
      window.back = this.prev
      try {
        window.$.invoke('toggleNavigation', { isShow: false })
        window.$.invoke('setTitle', { title: '心理探秘' })
      } catch (e) {

      }
    },
    mounted () {
      this.touchRefresh = window.touchRefresh(document.querySelector('.content'), { header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer') })
      var state = this.$route.params.secretSign
      if (state === false) {
        this.$nextTick(function () { // 进入页面时input输入框聚焦
          document.getElementById('input').focus()
          this.input = ''
        })
      } else {
        this.items = this.$store.state.article.searchArticleArr
        this.loadingShow = false
        this.input = this.$store.state.key
        this.$nextTick(function () { // 进入页面时input输入框聚焦
          document.getElementById('input').blur()
        })
      }
    },
    updated () {
      if (window.$.stationArr.length !== 0) {
        document.body.scrollTop = window.$.stationArr.pop()
      }
    },
    methods: {
      renderData: function (append = false) {
        var self = this
        var token = functions.getParam('token')
        var sendData = {
          access_token: token,
          page: this.page,
          key: this.input
        }
        this.$http.jsonp(
          functions.getURL('psychology-scout/search'),
          {
            params: sendData
          }).then(
            function (obj) {
              if (!append) {
                self.items = []
              }
              var results = obj.data.data
              console.log(results)
              this.$store.state.count = results.count
              this.$store.state.pageSize = results.page_size
              if (Array.isArray(results.list)) {
                if (results.list.length > 0) {
                  self.resultShow = false
                  for (var i = 0; i < results.list.length; i++) {
                    self.items.push(results.list[i])
                  }
                  if (self.items.length > 0) {
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
            }, function () {
              if (self.touchRefresh) {
                self.touchRefresh.recover()
              }
            })
      },
      search: function (event) {
        event.preventDefault()
        this.loadingShow = true
        this.page = 1
        this.renderData()
        this.$nextTick(function () { // 搜索完成后input输入框失去焦点
          document.getElementById('input').blur()
        })
        this.tempShow = false
        this.$store.state.key = this.input
      },
      searchData: function () {
        var self = this
        self.temps = []
        self.resultShow = false
        var token = functions.getParam('token')
        var sendData
        if (this.input !== ' ') {
          sendData = {
            access_token: token,
            page: this.page,
            key: this.input
          }
        }
        this.$http.jsonp(
          functions.getURL('psychology-scout/search'),
          {
            params: sendData
          }).then(
            function (obj) {
              var results = obj.data.data
              this.$store.state.count = results.count
              this.$store.state.pageSize = results.page_size
              try {
                if (Array.isArray(results.list)) {
                  for (var k = 0; k < results.list.length; k++) {
                    if (results.list[k].title.indexOf(this.input) !== -1) {
                      console.log(results.list[k].title)
                      if (self.temps.indexOf(results.list[k].title) === -1) { // 去重
                        self.temps.push(results.list[k].title)
                      }
                    }
                  }
                }
              } catch (e) {

              }
            }, function () {
              window.$.invoke('showMessage', { message: '网络请求失败' })
            })
      },
      select: function (temp) {
        this.input = temp
        this.tempShow = false
        this.page = 1
        this.loadingShow = true
        window.localStorage.removeItem('searchSecretStorage')
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
        console.log('append')
        if (this.page < Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
          this.page++
          this.renderData(true)
        } else if (this.page === Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
          window.$.invoke('showMessage', { message: '没有更多数据' })
          if (this.touchRefresh) {
            this.touchRefresh.recover()
          }
        }
      },
      getScroll: function (item) {
        console.log(document.body.scrollTop)
        window.$.stationArr.push(document.body.scrollTop)
        this.$store.state.article.searchArticleArr = this.items
        this.$router.push({ name: 'articledetail', params: { article_id: item.id } })
        this.$router.go(1)
      },
      clear: function () {
        this.input = ''
        this.tempShow = false
      },
      change: function (e) {
        if (e.target.value) {
          this.tempShow = true
          this.searchData()
          this.items = []
        } else {
          this.tempShow = false
        }
      },
      prev: function (event) {
        this.$nextTick(function () { // 进入搜索界面不搜索直接返回时input输入框失去焦点，收起软键盘
          document.getElementById('input').blur()
        })
        this.$router.go(-1)
      }
    }
  }

</script>
