<template>
  <div class='wrap'>
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="" v-on:click='search($event)'>
        <form action='' v-on:submit='search($event)'>
          <router-link :to="{name: 'searcharticle', params: {secretSign: false}}">
            <input id='input' type="text" placeholder="搜索" ref='input1' onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" autocomplete="off"
              v-model='input'>
          </router-link>
        </form>
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
      <div class='loading' v-if='loadingShow'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
    </div>
    <div id="pull-footer">
      <section>加载中...</section>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .content {
    margin-top: 0.8rem;
    & section{
      & span{
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
      & p{
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
  }
</style>
<script>
  import functions from '../../functions'
  export default {
    name: 'secret',
    data () {
      return {
        input: '',
        items: [],
        resultShow: false,
        loadingShow: true,
        touchRefresh: null,
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
      console.log('初始化')
      if (window.$.stationArr.length === 0) {
        this.input = ''
        this.renderData()
      } else {
        this.items = this.$store.state.article.articleArr
        this.loadingShow = false
      }
    },
    mounted () {
      this.touchRefresh = window.touchRefresh(document.querySelector('.content'), { header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer') })
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
              this.$store.state.count = results.count
              this.$store.state.pageSize = results.page_size
              if (Array.isArray(results.list)) {
                for (var i = 0; i < results.list.length; i++) {
                  self.items.push(results.list[i])
                }
                if (self.items.length === 0) {
                  self.resultShow = true
                  self.loadingShow = false
                } else {
                  self.resultShow = false
                  self.loadingShow = false
                }
              }
              if (this.touchRefresh) {
                this.touchRefresh.recover()
              }
            }, function () {
              if (this.touchRefresh) {
                this.touchRefresh.recover()
              }
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
          window.$.invoke('showMessage', { message: '没有更多数据' })
          if (this.touchRefresh) {
            this.touchRefresh.recover()
          }
        }
      },
      getScroll: function (item) {
        window.$.stationArr.push(document.body.scrollTop)
        this.$store.state.article.articleArr = this.items
        this.$router.push({ name: 'articledetail', params: { article_id: item.id } })
        this.$router.go(1)
      },
      prev: function (event) {
        this.$router.go(-1)
        try {
          window.$.invoke('toggleNavigation', { isShow: true })
          window.$.invoke('setTitle', { title: '首页' })
        } catch (e) {

        }
      }
    }
  }
</script>
