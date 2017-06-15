<template>
  <div class='wrap'>
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <router-link :to="{name: 'searchcognition', params: {cogSign: false}}">
          <input id='input' type="text" placeholder="搜索用户" ref='input1' @input="changeE($event)">
        </router-link>
      </section>
    </div>
    <div id='noContent' v-if='textShow'>
      <img src='../../assets/logo_no.png'>
      <p>暂无内容</p>
    </div>
    <!--<div id='noContent' v-if='flag' v-on:click='renderData'>
      <img src='../../assets/logo_no.png'>
      <p>点击重新加载</p>
    </div>-->
    <div id="pull-header" class="white">
      <section>刷新中...</section>
    </div>
    <div class='content' v-on:refresh="refresh" v-on:append="append">
      <section class='shell' v-for='item in items'>
        <router-link :to="{name: 'cognitionclass', params: {class_id: item.class_id}}">
          <h2 v-if="item.warning_person_num !== '0'" v-on:click='getScroll($event)'>{{item.class_name.fullName}}<span>{{item.sum_user}}人</span><span class='report_yes'>查看报告</span></h2>
        </router-link>
        <h2 v-if="item.warning_person_num === '0'" v-on:click='getScroll($event)'>{{item.class_name.fullName}}<span>{{item.sum_user}}人</span><span class='report_no'>暂无报告</span></h2>
        <ul>
          <li><span>{{item.join_user}}</span><span>参加测评</span></li>
          <li><span>{{item.finish_user}}</span><span>已经完成</span></li>
          <li><span>{{item.underway_user}}</span><span>课程进行</span></li>
          <li><span>{{item.warning_person_num}}</span><span>预警人数</span></li>
          <li><span class='sum_warn'>{{item.warning_sum}}</span><span>总预警数</span></li>
        </ul>
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
  .search {
    height: 10rem;
  }
  
  .content {
    position: relative;
    margin-top:0.5rem;
    & h2 {
      font-size: 1.8rem;
      color: #6c7079;
      margin-top: 0.8rem;
      & span:nth-child(1) {
        font-size: 1.6rem;
        color: #c2c3d8;
        margin-left: 1.5rem;
      }
      & .report_yes,
      & .report_no {
        display: inline-block;
        float: right;
        width: 6rem;
        height: 2rem;
        text-align: center;
        line-height: 2rem;
        border-radius: 1rem;
        font-size: 1.4rem;
        color: #fff;
      }
      
      & .report_yes {
        background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#2ca7ec), to(#1cd7ff));
      }
      
      & .report_no {
        background-color: #bdc0c7;
      }
    }
    & ul {
      width: 100%;
      & li {
        float: left;
        width: 20%;
        text-align: center;
        line-height: 2rem;
        margin: 1.5rem 0;
        & span:nth-child(1) {
          font-size: 1.8rem;
          color: #2dc9f4;
          width: 100%;
          display: inline-block;
          border-right: 1px solid #c2c3d8;
        }
        & span:nth-child(2) {
          font-size: 1.4rem;
          color: #aaaab9;
        }
        & .sum_warn {
          border-right: none;
        }
      }
    }
  }
  
  
</style>
<script>
  import functions from '../../functions'
  export default {
    name: 'cogition',
    created () {
      // functions.getLoadTime()
      window.back = this.prev
      try {
        window.$.invoke('toggleNavigation', { isShow: false })
        window.$.invoke('setTitle', { title: '认知' })
      } catch (e) {
      }
      if (window.$.stationArr.length === 0) {
        window.localStorage.removeItem('job')
        this.page = 1
        this.renderData()
      } else {
        // this.items = job
        console.log('刷新了吗')
        this.items = this.$store.state.cognition.cognitionArr
        this.loadingShow = false
        // this.$nextTick(function () {
        //   document.body.scrollTop = window.$.stationArr.pop()
        // })
      }
    },
    data () {
      return {
        items: [],
        textShow: false,
        loadingShow: true,
        touchRefresh: null,
        page: 1,
        flag: ''
      }
    },
    mounted () {
      this.touchRefresh = window.touchRefresh(document.querySelector('.content'), { header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer') })
      if (window.$.stationArr.length !== 0) {
        document.body.scrollTop = window.$.stationArr.pop()
      }
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
          functions.getURL('cognize'),
          {
            params: sendData
          }).then(
            function (obj) {
              console.log(obj, '收到的数据')
              if (!append) {
                self.items = []
              }
              var results = obj.data.data
              this.$store.state.count = results.count
              this.$store.state.pageSize = results.page_size
              if (Array.isArray(results.list)) {
                for (var i = 0; i < results.list.length; i++) { // self.items.push(results.list[i])
                  self.items.push(results.list[i])
                }
              }
              if (self.items.length === 0) {
                self.textShow = true
                self.loadingShow = false
              } else {
                self.textShow = false
                self.loadingShow = false
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
          window.$.invoke('showMessage', { message: '没有更多数据' })
          if (this.touchRefresh) {
            this.touchRefresh.recover()
          }
        }
      },
      getScroll: function (event) {
        window.$.stationArr.push(document.body.scrollTop)
        this.$store.state.cognition.cognitionArr = this.items
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
