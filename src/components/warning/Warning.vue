<template>
  <div class="wrap">
    <div id="pop" v-if='popShow'></div>
    <div class="search" v-if="JSON.stringify(this.$route.query) === '{}'">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <router-link :to="{name: 'searchwarn', params: {warnState: false}}">
          <input id='input' type="text" placeholder="搜索活动" ref='input1' @input="change($event)" v-model='searchVal'>
        </router-link>
      </section>
    </div>
    <div class='searchBgc' v-if='JSON.stringify(this.$route.query) !== "{}"'></div>
    <div id="warn" class="result">
      <section class='shell' v-show='JSON.stringify(this.$route.query) === "{}"'>
        <ul class="clearfix result_title">
          <li class="cur">
            <div :class="{new_warn: type ==='new', un_new: type !=='new' }" v-on:click="changeList(1)">最新预警</div>
            <div :class="{warn_bor: type ==='new', un_bor: type !=='new' }"></div>
          </li>
          <li class="cur">
            <div :class="{new_warn: type ==='30', un_new: type !=='30' }" v-on:click="changeList(2)">近30天内</div>
            <div :class="{warn_bor: type ==='30', un_bor: type !=='30' }"></div>
          </li>
          <li class="cur">
            <div :class="{new_warn: type ==='all', un_new: type !=='all' }" v-on:click="changeList(3)">全部</div>
            <div :class="{warn_bor: type ==='all', un_bor: type !=='all' }"></div>
          </li>
        </ul>
      </section>
      <div id="pull-header" v-if='JSON.stringify(this.$route.query) === "{}"'><section>刷新中...</section></div>
      <div id="pull-header" class="white" v-if='JSON.stringify(this.$route.query) !== "{}"'><section>刷新中...</section></div>
      <div class='content' v-on:refresh="refresh" v-on:append="append">
        <div id='noContent' v-if='isShow'>
          <img src='../../assets/logo_no.png'>
          <p>暂无内容</p>
        </div>
        <section class='shell' id="warn_new" v-for="item in items">
          <ul class="result_body">
            <li class="result_detail">
              <div class="body_title clearfix">
                <div class="warntype">{{item.role}}</div>
                <div class="warnname">{{item.name}}</div>
                <div class="warnclass">{{item.class_name}}</div>
                <router-link :to="{ name: 'warnfactor', params: { warn_id: item.id}}">
                  <div v-if='item.warning_level==="3"' class="warn_factor3" v-on:click='save'>
                    <img src='../../assets/warnRed.png'>
                    <div class="warn_factor_text">预警</div>
                  </div>
                  <div v-if='item.warning_level==="2"' class="warn_factor2" v-on:click='save'>
                    <img  src='../../assets/warnOrange.png'>
                    <!--<img v-if='item.warning_level==="1"' src='../../assets/warnyellow.png'>-->
                    <div class="warn_factor_text">预警</div>
                  </div>
                  <div v-if='item.warning_level==="1"' class="warn_factor1" v-on:click='save'>
                  <img src='../../assets/warnyellow.png'>
                  <div class="warn_factor_text">预警</div>
              </div>
                </router-link>
              </div>

              <div class="body_body clearfix">
                <div class="test">{{item.activity_name}}</div>
                <div class="scale clearfix">{{item.scale_title}}</div>
                <div class="date">{{item.created_at}}</div>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <div class='loading' v-if='loadingShow'>
          <img src='../../assets/cloud_blue.gif'>
        </div>
      <div id="pull-footer"><section>加载中...</section></div>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
.wrap{
    & .pop{
      z-index:1;
      background-color:#000;
      opacity:0;
      width:100%;
      height:100%;
      position:absolute;
      left:0;
      top:0;
      display:block;
    }
    & .search{
      height: 11rem;
    }
    & .searchBgc{
      width: 100%;
      height: 5.6rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
    & #pull-header{
      margin-top:0rem;
    }
    & .result{
      margin-top:-3.4rem;
      & .result_title{
          width: 100%;
          background-color: #fff;
          margin-bottom: 0.6rem;
      & li{
          float: left;
          width: 33%;
          height: 4rem;
          line-height: 4rem;
          text-align: center;
            & .new_warn{
              height: 2.5rem;
              font-size: 1.8rem;
              color: #3dbfff;
              font-family: 'Microsoft YaHei';
            }
            & .un_new{
              height: 2rem;
              font-size: 1.8rem;
              color:#c2c3d8;
              font-family:'Microsoft YaHei UI';
            }

            & .warn_bor{
              width: 25%;
              border-bottom-style: solid;
              border-bottom-width: 3px;
              border-bottom-color: #3dbfff;
              margin: 2.9rem auto;
            }
            & .un_bor{
              border-bottom-style:solid;
              border-bottom-width:0;
              border-bottom-color:#3dbfff;
            }
          }
        }
      }
      & .content{
        width:100%;
        height:auto;
        position:relative;
        margin-top: 0.25rem;
        & #noContent{
          transform: translate(-50%,150%);
        }
        & .result_detail{
          width: 100%;
          height: 100%;
          color: #95989e;
          margin: 0 0 0.6rem 0;
          padding-bottom: 1rem;
          background-color: #ffffff;
          & .body_title{
            margin-left: 1rem;
            margin-right: 1rem;
            height: 4rem;
            line-height: 2rem;
            & .warntype{
              float: left;
              width: 18%;
              height: 2rem;
              line-height: 2rem;
              color: #3dbfff;
              text-align: center;
              font-size: 1.4rem;
              border-radius: 1rem;
              margin-top: 0.6rem;
              border: 1px solid #3dbfff;
            }
            & .warnname{
              float: left;
              width: 24%;
              height: 2rem;
              line-height: 2rem;
              text-align: center;
              font-size: 1.8rem;
              color: #6c7079;
              margin: 0.6rem 0.5rem 0rem 0.5rem;
              overflow:hidden;
            }
            & .warnclass{
              float: left;
              width: 24%;
              height: 2rem;
              line-height: 2rem;
              text-align: left;
              font-size: 1.6rem;
              color: #c2c3d8;
              margin-top: 0.6rem;
              margin-left: 0.5rem;
              overflow:hidden;
            }
            & .warn_factor1{
              float: right;
              width: 22%;
              height: 3rem;
              line-height: 3rem;
              border-radius: 2rem;
              margin-top: 0.4rem;
              background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#ffcc1a), to(#ffdf32));
            }
            & .warn_factor2{
              float: right;
              width: 22%;
              height: 3rem;
              line-height: 3rem;
              border-radius: 2rem;
              margin-top: 0.4rem;
              background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#ff9c40), to(#ffbb07));
            }
            & .warn_factor3{
              float: right;
              height: 3rem;
              line-height: 3rem;
              border-radius: 2rem;
              margin-top: 0.4rem;
              background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#ff435f), to(#fe4f87));
            }
            & .warn_factor1, & .warn_factor2,& .warn_factor3{
              & img{
                width: 1.6rem;
                float: left;
                margin: 0.7rem 0.5rem 0.7rem 0.8rem;
              }
              & .warn_factor_text{
                font-size: 1.5rem;
                color: #fff;
                padding-right: 0.4rem;
                float:left;
              }
              & .warn_factor_sign{
                width:2rem;
                height:2rem;
                border-radius:1rem;
                background-color: #fff;
                float:left;
                font-size:1.6rem;
                color:#ff435f;
              }
            }

          }
          & .body_body{
            & .scale{
              width:100%;
              margin:0.2rem 2rem;
              font-size:1.8rem;
              color:#c2c3d8;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-align:left;
              height:2.5rem;
              line-height:2.5rem;
            }
            & .test{
              font-size:1.8rem;
              color:#6c7079;
              height: 2rem;
              line-height: 2rem;
              margin: 0 2rem;
              overflow: hidden;
              text-align: left;
            }
            & .date{
              font-size:1.7rem;
              color:#c2c3d8;
              float:left;
              margin: 0 2rem;
              height: 2rem;
              line-height: 2rem;
            }
          }
        }
      }
  }




</style>
<script>
import functions from '../../functions'
export default {
  name: 'warn',
  created () {
    if (window.entrance !== 'prewarn') {
      window.back = this.prev
    } else {
      if (JSON.stringify(this.$route.query) === '{}') {
        window.back = function () {
          window.$.invoke('goBack', {})
        }
      } else {
        window.back = this.prev
      }
    }
    try {
      window.$.invoke('toggleNavigation', { isShow: window.entrance === 'prewarn' })
      window.$.invoke('setTitle', { title: '预警' })
    } catch (e) {

    }
    console.log(window.$.stationArr.length)
    if (JSON.stringify(this.$route.query) === '{}') {
      if (window.$.stationArr.length === 0) { // 进入预警列表页初始化
        if (this.$route.params.type === 'new') {
          this.changeList(1)
        } else if (this.$route.params.type === '30') {
          this.changeList(2)
          window.back = this.prev
        } else if (window.entrance === 'prewarn') {
          this.changeList(1)
        }
      } else { // 列表页点击定位
        this.$nextTick(function () {
          document.body.scrollTop = window.$.stationArr.pop()
        })
        this.type = this.$store.state.warning.searchType
        this.items = this.$store.state.warning.warningArr
        this.loadingShow = false
      }
    } else if (JSON.stringify(this.$route.query) !== '{}') { // 从搜索页点击结果进入列表页
      console.log(window.$.stationArr.length)
      if (this.$route.query.status === true) { // 从搜索页点击结果进入列表页的初始状态
        this.page = 1
        this.renderData('warning/user-report-search')
      } else if (window.$.stationArr.length > 0) { // 从搜索页点击结果进入列表页的定位问题
        this.$nextTick(function () {
          document.body.scrollTop = window.$.stationArr.pop()
        })
        this.items = this.$store.state.warning.warningArr
        this.loadingShow = false
      }
    }
    var self = this
    window.setTimeout(function () {
      self.popShow = false
    }, 1200)
  },
  data () {
    return {
      warnShow: false,
      items: [],
      searchVal: '',
      type: 'new',
      isShow: false,
      loadingShow: true,
      popShow: true,
      touchRefresh: null,
      page: 1
    }
  },
  mounted () {
    this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
  },
  methods: {
      // 渲染数据
    renderData: function (url, append = false) {
      var self = this
      this.$store.state.page = this.page
      var token = functions.getParam('token')
      var sendData
      if (JSON.stringify(self.$route.query) === '{}') {
        sendData = {
          access_token: token,
          page: this.page,
          type: this.type
        }
      } else if (JSON.stringify(self.$route.query) !== '{}') {
        sendData = {
          access_token: token,
          page: this.page,
          user_id: self.$route.query.user_id
        }
      }
      this.$http.jsonp(
        functions.getURL(url),
        {
          params: sendData
        }).then(
          function (obj) {
            console.log(obj, '收到的数据')
            var results = obj.data.data
            this.$store.state.count = results.warning_data.count
            this.$store.state.pageSize = results.warning_data.page_size
            try {
              if (!append) {
                self.items = []
              }
              if (Array.isArray(results.warning_data.list)) {
                let warnObj1 = {
                  '10': '学生',
                  '11': '心理老师',
                  '12': '家长',
                  '13': '班主任',
                  '14': '档案管理员',
                  '15': '教育局',
                  '16': '校长',
                  '30': '学科老师'
                }
                for (var i = 0; i < results.warning_data.list.length; i++) {
                  // 姓名班级
                  var warnObj = results.warning_data.list[i]
                  warnObj.role = warnObj1[warnObj.role + '']
                  // if (parseInt(warnObj.role) === 10) {
                  //   warnObj.role = '学生'
                  // } else if (parseInt(warnObj.role) === 11) {
                  //   warnObj.role = '心理老师'
                  // } else if (parseInt(warnObj.role) === 12) {
                  //   warnObj.role = '家长'
                  // } else if (parseInt(warnObj.role) === 13) {
                  //   warnObj.role = '班主任'
                  // } else if (parseInt(warnObj.role) === 14) {
                  //   warnObj.role = '档案管理员'
                  // } else if (parseInt(warnObj.role) === 15) {
                  //   warnObj.role = '教育局'
                  // } else if (parseInt(warnObj.role) === 16) {
                  //   warnObj.role = '校长'
                  // } else if (parseInt(warnObj.role) === 30) {
                  //   warnObj.role = '学科老师'
                  // }
                  if (warnObj.class_name === '') {
                    warnObj.class_name = '--'
                  } else {
                    warnObj.class_name = warnObj.class_name.fullName
                  }
                  warnObj.created_at = functions.getLocalTime(warnObj.created_at * 1000).substr(0, 10)
                  // 显示量表的个数
                  if (warnObj.scale_title.length > 15) {
                    warnObj.scale_title = warnObj.scale_title.substr(0, 15) + '...'
                  }
                  self.items.push(warnObj)
                }
              }
              if (self.items.length === 0) {
                self.isShow = true
                self.loadingShow = false
                // self.popShow = true
              } else {
                self.isShow = false
                self.loadingShow = false
                // self.popShow = false
              }
            } catch (e) {

            }
            if (self.touchRefresh) { // 上拉下拉吸附效果
              self.touchRefresh.recover()
            }
          }, function () {
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
    },
    refresh: function () {
      this.page = 1
      if (JSON.stringify(this.$route.query) === '{}') {
        this.renderData('warning')
        this.titleShow = true
      } else if (JSON.stringify(this.$route.query) !== '{}') {
        this.renderData('warning/user-report-search')
      }
    },
    append: function () {
      console.log('append')
      if (this.page < Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        this.page++
        if (JSON.stringify(this.$route.query) === '{}') {
          this.renderData('warning', true)
        } else if (JSON.stringify(this.$route.query) !== '{}') {
          this.renderData('warning/user-report-search', true)
        }
      } else if (this.page === Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        window.$.invoke('showMessage', {message: '没有更多数据'})
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }
    },
      // 点击切换list
    changeList: function (sign) {
      this.items = []
      this.$store.state.page = 1
      this.loadingShow = true
      this.isShow = false
      var self = this
      self.popShow = true
      window.setTimeout(function () {
        self.popShow = false
      }, 1200)
      if (sign === 1) {
        this.type = 'new'
        this.renderData('warning')
      } else if (sign === 2) {
        this.type = '30'
        this.renderData('warning')
      } else if (sign === 3) {
        this.type = 'all'
        this.renderData('warning')
      }
      this.$store.state.warning.searchType = this.type
    },
    save: function () {
      window.$.stationArr.push(document.body.scrollTop)
      this.$store.state.warning.warningArr = this.items
      this.$store.state.page = this.page
    },
    prev: function (event) {
      if (!this.$route.query.status) { // 从首页进入预警列表页
        try {
          window.$.invoke('toggleNavigation', { isShow: true })
          window.$.invoke('setTitle', { title: '首页' })
        } catch (e) {

        }
      }
      this.$router.go(-1)
    }
  }
}

</script>
