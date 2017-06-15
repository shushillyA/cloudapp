<template>
  <div class='wrap'>
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <router-link :to="{ name: 'searchsandtable', params: {sandSign: false}}">
          <input id='input' type="text" placeholder="搜索用户" ref='input1' @input="changeE($event)">
        </router-link>
      </section>
    </div>
    <div id="pull-header" class="white"><section>刷新中...</section></div>
    <div v-if='sandShow' id='noContent'>
        <img src='../../assets/logo_no.png'>
        <p>暂无内容</p>
      </div>
    <div class='content' v-on:refresh="refresh" v-on:append="append">
      <div v-for='item in items'>
        <router-link :to="{ name: 'sandreport',  params: { report_id: item.report_id, sex: item.sex, name: item.name, class_name: item.class_name, age: item.age, create_time: item.create_time, costtime: item.costtime, report_no: item.report_no}}">
        <section class='shell detail' v-on:click='getScroll($event)'>
          <img id='signImg' src='../../assets/sign.png'>
          <p id='name'>{{item.name}}</p>
          <!--<p id='class'>{{item.class_name.fullName}}</p>-->
          <p id='class'>{{item.class_name}}</p>
          <p id='number'>第<span>{{item.report_no}}</span>次</p>
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
      height: 10rem;
    }
    & .content{
      width:100%;
      height:100%;
      position:relative;
      margin-top:0.5rem;
      & .detail {
        & img{
          float: left;
          width: 3rem;
          height: 3rem;
          margin-top: 0.25rem;
          margin-right: 0.5rem;
        }
        & p:nth-child(2) {
          float:left;
          font-size:1.8rem;
          color:#6c7079;
          margin-right:1rem;
          line-height:3rem;
        }
        & p:nth-child(3) {
          float: left;
          font-size: 1.6rem;
          color: #bdc0c7;
          line-height: 3rem;
          width: 46%;
          height: 3rem;
          overflow: hidden;
        }
        & p:nth-child(4) {
          float:right;
          font-size:1.6rem;
          color:#bdc0c7;
          line-height:3rem;
          & span{
            color:#3dbfff;
          }
        }
      }
    }
  }
</style>
<script>
import functions from '../../functions'
export default {
  name: 'sandtable',
  created () {
    if (window.$.stationArr.length === 0) {
      this.$store.state.sand.sandTable = []
      this.page = 1
      this.renderData()
    } else {
      this.items = this.$store.state.sand.sandTableArr
      this.loadingShow = false
      this.$nextTick(function () {
        document.body.scrollTop = window.$.stationArr.pop()
      })
    }
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '沙盘' })
    } catch (e) {

    }
  },
  data () {
    return {
      items: [],
      sandShow: false,
      loadingShow: true,
      count: 0,
      pageSize: 0,
      temp: [],
      sandTable: [],
      page: 1,
      touchRefresh: null
    }
  },
  mounted () {
    this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
  },
  methods: {
          // 渲染数据
    renderData: function (append = false) {
      var self = this
        // 渲染数据
      this.$http.jsonp(functions.getURL('sand'), functions.sendParam({'page': this.page})).then(function (obj) {
        console.log(obj, '收到的数据sandtable')
        obj = obj.data
        var results = obj.data
        this.$store.state.count = results.count
        this.$store.state.pageSize = results.page_size
        try {
          if (!append) {
            self.items = []
            self.temp = []
          }
          if (Array.isArray(results.list)) {
            for (var i = 0; i < results.list.length; i++) {
              results.list[i].costtime = JSON.parse(results.list[i].weidu1).costtime
              self.items.push(results.list[i])
            }
            if (self.items.length === 0) {
              self.sandShow = true
              self.loadingShow = false
            } else {
              self.sandShow = false
              self.loadingShow = false
            }
          }
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
      var self = this
      this.page = 1
      self.renderData(false)
    },
    append: function () {
      console.log('append')
      var self = this
      if (this.page < Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        this.page++
        self.renderData(true)
      } else if (this.page === Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        window.$.invoke('showMessage', {message: '没有更多数据'})
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }
    },
    getScroll: function (event) {
      console.log(document.body.scrollTop)
      window.$.stationArr.push(document.body.scrollTop)
      console.log(document.documentElement.scrollTop)
      this.$store.state.sand.sandTableArr = this.items
      this.$store.state.page = this.page
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
