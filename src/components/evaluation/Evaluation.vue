<template>
  <div class="wrap">
    <div class="pop" v-if='popShow'></div>
    <!--从首页进去显示输入框-->
    <div class="search" v-if='JSON.stringify(this.$route.query) === "{}"'>
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <router-link :to="{name: 'search_evaluation', params: {evalState: false}}">
          <input id='input' type="text" placeholder="搜索用户、活动、量表" v-model='searchVal' @input="changeE($event)">
        </router-link>
      </section>
    </div>
    <div class='searchBgc' v-if='JSON.stringify(this.$route.query) !== "{}"'></div>
    <!--从首页进去显示title-->
    <div class='container'>
      <section class='shell result_title' v-show='JSON.stringify(this.$route.query) === "{}"'>
      <ul>
        <li>
          <div :class="{cur_text: stateNum===1, un_text: stateNum!==1 }" v-on:click="changeList(1)">进行中</div>
          <div :class="{cur_bor: stateNum===1, un_bor: stateNum!==1}"></div>
        </li>
        <li>
          <div :class="{cur_text: stateNum===2, un_text: stateNum!==2 }" v-on:click="changeList(2)">已完成</div>
          <div :class="{cur_bor: stateNum===2, un_bor: stateNum!==2}"></div>
        </li>
      </ul>
    </section>
    <div id="pull-header" v-if='JSON.stringify(this.$route.query) === "{}"'>
      <!--从首页进去列表页-->
      <section>刷新中...</section>
    </div>
    <div id="pull-header" class='white' v-if='JSON.stringify(this.$route.query) !== "{}"'> <!--从搜索页进入搜索内页-->
    <section>刷新中...</section>
    </div>
    <div v-if='isShow' id='noContent'>
      <img src='../../assets/logo_no.png'>
      <p>暂无内容</p>
    </div>
    <div class='content' v-on:refresh="refresh" v-on:append="append">
      <section class='shell' v-for="item in items">
        <section>
          <p>{{item.ce_type}}</p>
          <p>{{item.title}}</p>
          <!--初始化的测评列表学生和家长查看报告（班级--参与人--量表--报告）-->
          <router-link :to="{ name: 'evaluation_classlist', params: { act_id: item.id, role: item.user_type}}">
            <div class='view_report' v-if="(item.user_type==='学生' || item.user_type==='家长') && (item.report===1 || item.report==='1') && (searchType==='')"v-on:click='save(item)'>查看报告</div>
          </router-link>
          <div class='no_report' v-if="(item.user_type==='学生' || item.user_type==='家长') && (item.report===0 || item.report==='0') && (searchType==='')" v-on:click='save(item)'>暂无报告</div>
          <!--初始化的测评列表教职工查看报告（参与人--量表--报告）-->
          <router-link :to="{ name: 'evaluation_joinlist', params: { act_id: item.id, role: item.user_type}}">
            <div class='view_report' v-if="item.user_type=='教职工' && (item.report===1 || item.report==='1') && (searchType==='')" v-on:click='save(item)'>查看报告 </div>
          </router-link>
          <div class='no_report' v-if="item.user_type=='教职工' && (item.report===0 || item.report==='0') && (searchType==='')" v-on:click='save(item)'>暂无报告</div>
          <!--搜索内页搜索用户查看报告（用户名--量表--报告）-->
          <router-link :to="{ name: 'evaluation_scalelist', params: { actjoin_id: item.id, user_id: item.user_id}}">
            <div class='view_report' v-if="(searchType==='用户') && (item.report===1 || item.report==='1')" v-on:click='save(item)'>查看报告</div>
          </router-link>
          <div class='no_report' v-if="(searchType==='用户') && (item.report===0 || item.report==='0')" v-on:click='save(item)'>暂无报告 </div>
          <!--搜索内页搜索活动查看报告（活动名称--班级/无班级跳过--参与人--量表--报告）-->
          <router-link :to="{ name: 'evaluation_classlist', params: { act_id: item.act_id, role: item.user_type}}">
            <div class='view_report' v-if="(searchType==='活动') && (item.report===1 || item.report==='1')" v-on:click='save(item)'>查看报告</div>
          </router-link>
          <div class='no_report' v-if="(searchType==='活动') && (item.report===0 || item.report==='0')" v-on:click='save(item)'>暂无报告 </div>
          <!--搜索内页搜索量表查看报告（量表名称--活动名称--班级/无班级跳过--参与人--报告）-->
          <router-link :to="{ name: 'evaluation_activitylist', params: { act_id: item.act_id, role: item.user_type}}">
            <div class='view_report' v-if="(searchType==='量表') && (item.report===1 || item.report==='1')" v-on:click='save(item)'>查看报告</div>
          </router-link>
          <div class='no_report' v-if="(searchType==='量表') && (item.report===0 || item.report==='0')" v-on:click='save(item)'>暂无报告</div>
          <!--家长班主任教职工开始测评-->
          <!--<div class='view_evaluate'>开始测评</div>-->
          <!--<div class='overdure'>已过期</div>-->
        </section>
        <section>{{item.scale}}</section>
        <section class='promot'>
          <div>发起:{{item.promoter}}</div>
          <div>
            <p>{{item.valid_start_time}}~</p>
            <p>{{item.end_time}}</p>
          </div>
        </section>
        <!--<section class='activity_ongoing'>
          <span>活动周期:</span>
          <span>2017-04-07</span>
          <span>~</span>
          <span>2017-05-20</span>
        </section>-->
        <!--<section class='activity_finished'>
          <span>完成日期：2014-05-20</span>
        </section>-->
      </section>
    </div>
  <div class='loading' v-if='loadingShow'>
    <img src='../../assets/cloud_blue.gif'>
  </div>
  <div id="pull-footer">
    <section>加载中...</section>
  </div>
    </div>
  </div>
</template>
<script>
  import functions from '../../functions'
  export default {
    name: 'evaluation',
    created () {
      this.role = this.$store.state.role
      this.stateNum = this.$store.state.evaluation.evalState
      this.searchType = this.$store.state.evaluation.searchEvalType
      functions.getLoadTime()
      console.log(this.$store.state.role, '用户角色')
      if (window.entrance !== 'evaluation') {
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
        if (window.entrance === 'evaluation' && JSON.stringify(this.$route.query) === '{}') {
          window.$.invoke('toggleNavigation', { isShow: true }) // 隐藏返回显示底部
          // window.$.invoke('showMessage', {message: '没有路由参数'})
        } else if (window.entrance === 'evaluation' && JSON.stringify(this.$route.query) !== '{}') {
          window.$.invoke('toggleNavigation', { isShow: false })
          // window.$.invoke('showMessage', {message: '有路由参数' + JSON.stringify(this.$route.query)})
        } else if (window.entrance !== 'evaluation') {
          window.$.invoke('toggleNavigation', { isShow: false }) // 显示返回  隐藏底部
          // window.$.invoke('showMessage', {message: '其他情况'})
        }
        window.$.invoke('setTitle', { title: '测评' })
      } catch (e) {

      }
      if (JSON.stringify(this.$route.query) === '{}') { // 初始化列表页
        if (window.$.stationArr.length === 0) {
          this.$store.state.evaluation.evalTemp = []
          this.stateNum = 1
          this.renderData('activity')
        } else if (window.$.stationArr.length > 0) { // 列表页点击定位
          this.$nextTick(function () {
            document.body.scrollTop = window.$.stationArr.pop()
          })
          this.items = this.$store.state.evaluation.evaluationArr
          this.loadingShow = false
          console.log(this.$store.state.evaluation.evalState)
        }
      } else if (JSON.stringify(this.$route.query) !== '{}') {
        this.searchType = this.$route.query.type
        this.$store.state.searchType = this.$route.query.type // 将搜素类型存在state中，方便在参与人界面获取
        console.log(this.searchType)
        if (this.$route.query.status === true) {
          this.page = 1
          this.renderData('activity/get-act') // 搜索页进入测评列表页  过滤列表
          console.log(this.items)
        } else if (window.$.stationArr.length > 0) { // 搜索页进入测评列表页 点击定位
          this.loadingShow = false
          this.isShow = false
          this.$nextTick(function () {
            document.body.scrollTop = window.$.stationArr.pop()
          })
          this.items = this.$store.state.evaluation.evaluationArr
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
        items: [],
        searchVal: '',
        isShow: false,
        loadingShow: true,
        popShow: true,
        searchType: '', // 搜索后进入内页的搜索类型
        role: '',
        page: 1,
        touchRefresh: null,
        count: '',
        pageSize: '',
        stateNum: 1

      }
    },
    mounted () {
      this.touchRefresh = window.touchRefresh(document.querySelector('.content'), { header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer') })
    },
    methods: {
      renderData: function (url, append = false) {
        var self = this
        var token = functions.getParam('token')
        var sendData
        if (JSON.stringify(self.$route.query) === '{}') { // 测评列表页
          sendData = {
            access_token: token,
            type: this.stateNum, // num为1时是进行中   其他为已完成
            page: this.page
          }
        } else if (JSON.stringify(self.$route.query) !== '{}') { // 点击搜索结果进入的测评列表
          sendData = {
            access_token: token,
            act_id: self.$route.query.act_id,
            page: this.page
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
              self.$store.state.count = results.activity_data.count
              self.$store.state.pageSize = results.activity_data.page_size
              try {
                if (!append) {
                  self.items = []
                  self.storage = []
                }
                if (Array.isArray(results.activity_data.list)) {
                  for (var i = 0; i < results.activity_data.list.length; i++) {
                    var listObj = results.activity_data.list[i]
                    if (parseInt(listObj.ce_type) === 1) {
                      listObj.ce_type = '个测'
                    } else if (parseInt(listObj.ce_type) === 0) {
                      listObj.ce_type = '普测'
                    }
                    //              时间戳的转换
                    listObj.valid_start_time = functions.getLocalTime(parseInt(listObj.valid_start_time) * 1000).substr(0, 11)
                    listObj.end_time = functions.getLocalTime(parseInt(listObj.end_time) * 1000).substr(0, 11)
                    //                类型
                    if (parseInt(listObj.user_type) === 1) {
                      listObj.user_type = '学生'
                    } else if (parseInt(listObj.user_type) === 2) {
                      listObj.user_type = '家长'
                    } else if (parseInt(listObj.user_type) === 3) {
                      listObj.user_type = '教职工'
                    }
                    // 显示量表的个数
                    if (Array.isArray(listObj.scale)) {
                      if (listObj.scale.length > 1) {
                        listObj.scale = listObj.scale[0] + '等'
                      } else {
                        listObj.scale = listObj.scale[0]
                      }
                    }
                    listObj['class_id'] = self.$store.state.evaluation['class_id']
                    console.log('赋值route')
                    if (JSON.stringify(self.$route.query) !== '{}') {
                      console.log(self.$route.query, 'route参数')
                      listObj['act_id'] = self.$route.query.act_id
                      listObj['user_id'] = self.$route.query.user_id
                    }
                    self.items.push(listObj)   // 放入数组
                  }
                }
                if (self.items.length === 0) {
                  self.isShow = true
                } else {
                  self.isShow = false
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
        this.stateNum = this.$store.state.evaluation.evalState
        if (JSON.stringify(this.$route.query) === '{}') {
          this.page = 1
          this.renderData('activity')
        } else if (JSON.stringify(this.$route.query) !== '{}') {
          this.page = 1
          this.renderData('activity/get-act')
        }
      },
      append: function () {
        if (this.page < Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
          this.page++
          if (JSON.stringify(this.$route.query) === '{}') {
            this.renderData('activity', true)
          } else if (JSON.stringify(this.$route.query) !== '{}') {
            this.renderData('activity/get-act', true)
          }
        } else if (this.page === Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
          window.$.invoke('showMessage', { message: '没有更多数据' })
          if (this.touchRefresh) {
            this.touchRefresh.recover()
          }
        }
      },
      // 点击切换list
      changeList: function (sign) {
        this.items = []
        this.page = 1
        this.popShow = true
        this.loadingShow = true
        this.isShow = false
        var self = this
        window.setTimeout(function () {
          self.popShow = false
        }, 1200)
        this.$store.state.evaluation.evalTemp = []
        if (sign === 1) {  // 进行中
          this.stateNum = 1
          this.$store.state.evaluation.evalState = this.stateNum
          this.renderData('activity') // 1进行中
        } else if (sign === 2) { // 已完成
          this.stateNum = 2
          this.$store.state.evaluation.evalState = this.stateNum
          this.renderData('activity') // 其他已完成
        }
      },
      save: function (item) {
        window.$.stationArr.push(document.body.scrollTop)
        window.$.roleArr.push(item.user_type)
        console.log('save' + this.$store.state.evaluation.evalState)
        this.$store.state.evaluation.evaluationArr = this.items
        this.$store.state.page = this.page
      },
      prev: function (event) {
        if (JSON.stringify(this.$route.query) === '{}') {
          this.$router.go(-1)
          try {
            window.$.invoke('toggleNavigation', { isShow: true })
            window.$.invoke('setTitle', { title: '首页' })
          } catch (e) {
          }
        } else {
          this.$router.go(-1)
        }
        this.$store.state.searchType = '' // 每次回到首页时将searchType置空
        this.$store.state.evaluation.evalState = 1
      }
    }
  }

</script>
<style lang='postcss' scoped>
  .wrap {
    & .pop {
      z-index: 1;
      background-color: #000;
      opacity: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: block;
    }
    & .search {
      height: 10.6rem;
    }
    & .searchBgc {
      width: 100%;
      height: 5.6rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#3095fc), to(#2cd2f1));
    }
    & .container{
      margin-top:-3.25rem;
      & .result_title {
        height: 6rem;
        line-height: 4rem;
        background-color: #fff;
        & li {
          float: left;
          width: 48%;
          text-align: center;
        }
        & .cur_text {
          font-size: 1.8rem;
          color: #3dbfff;
          font-family: 'Microsoft YaHei';
        }
        & .un_text {
          font-size: 1.8rem;
          color: #c2c3d8;
          font-family: 'Microsoft YaHei UI';
        }
        & .cur_bor {
          width: 20%;
          border-bottom-style: solid;
          border-bottom-width: 3px;
          border-bottom-color: #3dbfff;
          margin: 0.7rem auto;
        }
        & .un_bor {
          width: 16%;
          border-bottom-style: solid;
          border-bottom-width: 0;
          border-bottom-color: #3dbfff;
          margin-left: 3rem;
          align-items: center;
          justify-content: center;
        }
      }

      & #pull-header{
        margin-top:0rem;
      }
      
      & .content {
        width: 100%;
        height: 100%;
        position: relative;
        margin-top: 0.25rem;
        & .shell {
          padding: 4%;
          & section:nth-child(1) {
            width: 100%;
            & p:nth-child(1) {
              width: 4rem;
              height: 2rem;
              text-align: center;
              line-height: 2rem;
              float: left;
              border-radius: 1rem;
              color: #3dbfff;
              margin-right: 1rem;
              font-size: 1.4rem;
              border: 1px solid #3dbfff;
              margin-top: 0.5rem;
            }
            & p:nth-child(2) {
              width: 58%;
              height: 3rem;
              line-height: 3rem;
              font-size: 1.8rem;
              color: #6c7079;
              float: left;
              overflow: hidden;
              text-align: left;
            }
            & .view_report, & .view_evaluate {
              float: right;
              width: 24%;
              height: 3rem;
              line-height: 3rem;
              border-radius: 2rem;
              color: #fff;
              font-size: 1.6rem;
              text-align: center;
              background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#38b7ff), to(#02d4ff));
            }
            & .no_report,& .overdure {
              float: right;
              width: 24%;
              height: 3rem;
              line-height: 3rem;
              border-radius: 2rem;
              color: #fff;
              font-size: 1.6rem;
              text-align: center;
              background: #dcdfea;
            }
          }
          & section:nth-child(2) {
            height: 3rem;
            line-height: 3.4rem;
            border-radius: 5px;
            font-size: 1.8rem;
            color: #a3a7b0;
            clear: both;
            text-align: left;
            overflow: hidden;
            padding-bottom: 4rem;
            border-bottom: 1px solid #e0e2e7;
          }
          & .promot {
            margin-top:1rem;
            & div:nth-child(1) {
              float: left;
              height: 3rem;
              line-height: 3rem;
              color: #bdc0c7;
              font-size: 1.8rem;
              width: 38%;
              overflow: hidden;
              white-space: nowrap;
              text-align: left;
            }
            & div:nth-child(2) {
              height: 3rem;
              line-height: 3rem;
              color: #bdc0c7;
              font-size: 1.8rem;
              text-align: right;
              float: left;
              & p{
                height: 3rem;
                line-height: 3rem;
                color: #bdc0c7;
                font-size: 1.8rem;
                text-align: right;
                float: left;
              }
            }
          }
          & .activity_ongoing, & .activity_finished{
             margin-top:1rem;
             & span{
               height:3rem;
               line-height: 3rem;
               color: #bdc0c7;
               font-size: 1.7rem;
             }
          }
        }
      }
    }
  }
</style>
