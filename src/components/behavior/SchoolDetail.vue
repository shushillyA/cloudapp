<template>
  <div class='wrap'>
    <div class="search"></div>
    <div id='noContent' v-if='textShow'>
      <img src='../../assets/logo_no.png'>
      <p>暂无内容</p>
    </div>
    <!--<div id='noContent' v-if='flag' v-on:click='renderData'>
      <img src='../../assets/logo_no.png'>
      <p>点击重新加载</p>
    </div>-->
    <div class='content'>
      <section class='shell' v-for='item in items'>
        <!--路由跳转-->
        <router-link :to="{name: 'datedetail', params: {org_id: item.orgId, ids: item.ids_data, date:item.date, day:item.record_data}}">
          <h2 v-if="item.warning_data !== 0" v-on:click='getScroll($event)'>{{item.date}}<span class='report_yes'>查看详情</span></h2>
        </router-link>
        <h2 v-if="item.warning_data === 0" v-on:click='getScroll($event)'>{{item.date}}<span class='report_no'>暂无预警</span></h2>
        <ul>
          <li><span>{{item.num_data}}</span><span>记录人数</span></li>
          <li><span class='warning_num'>{{item.warning_data}}</span><span>预警人数</span></li>
          <li><span>{{item.rate_data}}</span><span>预警率</span></li>
          <li><span class='no_deal'>{{item.deal_data}}</span><span>未处理</span></li>
        </ul>
      </section>
    </div>
    <div class='empty'></div>
    <div class='loading' v-if='loadingShow'>
      <img src='../../assets/cloud_blue.gif'>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .search {
    height: 8rem;
  }
  
  .content {
    position: relative;
    margin-top:-6rem;
    & h2 {
      font-size: 1.8rem;
      color: #6c7079;
      margin-top: 0.8rem;
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
        box-shadow: 0 0 1.6rem #a7dffa;
      }
      
      & .report_no {
        background-color: #bdc0c7;
      }
    }
    & ul {
      width: 100%;
      & li {
        float: left;
        width: 25%;
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
        & .warning_num{
          color:#ff5cb4 !important;
        }
        & span:nth-child(2) {
          font-size: 1.4rem;
          color: #bdc0c7;
        }
        & .no_deal {
          border-right: none !important;
        }
      }
    }
  }
  .empty{
    width:100%;
    height:4rem;
  }
  
  
</style>
<script>
  import functions from '../../functions'
  export default {
    name: 'cogition',
    created () {
      console.log(this.$store.state.behavior.school, '刷新了吗')
      functions.getLoadTime()
      window.back = this.prev
      if (this.$store.state.behavior.school.length >= 8) {
        this.title = this.$store.state.behavior.school.substr(0, 8) + '...'
      } else {
        this.title = this.$store.state.behavior.school
      }
      try {
        window.$.invoke('toggleNavigation', { isShow: false })
        window.$.invoke('setTitle', {title: this.title})
      } catch (e) {
      }
      console.log(this.$route.query)
      if (window.$.stationArr.length === 0) {
        window.localStorage.removeItem('job')
        this.page = 1
        this.renderData()
      } else {
        // this.items = job
        console.log('刷新了吗')
        this.items = this.$store.state.behavior.schoolArr
        this.loadingShow = false
      }
    },
    data () {
      return {
        items: [],
        textShow: false,
        loadingShow: true,
        touchRefresh: null,
        page: 1,
        flag: '',
        count: 0,
        title: ''
      }
    },
    mounted () {
      // this.touchRefresh = window.touchRefresh(document.querySelector('.content'), { header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer') })
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
          page: this.page,
          org_id: this.$route.query.org_id
        }
        this.$store.state.behavior.org_id = this.$route.query.org_id
        functions.orgId = this.$route.query.org_id
        console.log(this.org_id, 'org_id')
        this.$http.jsonp(
          functions.getURL('edu-bwarning/behavior-school'),
          {
            params: sendData
          }).then(
            function (obj) {
              console.log(obj)
              console.log(obj.data, '学校数据成功')
              if (!append) {
                // 如果不是添加 清空
                self.items = []
              }
              var recordData = obj.data.data.record_data
              var numData = obj.data.data.num_data
              var warningData = obj.data.data.warning_data
              var dealData = obj.data.data.deal_data
              // 添加ids
              var idsData = obj.data.data.ids_data
              // console.log(obj.data.data.num_data['2017-05-10'][0], '测试')
              var itemObj = {date: '', num_data: '', warning_data: '', rate_data: '', deal_data: '', ids_data: '', orgId: this.$route.query.org_id}
              // 日期, 记录人数  预警人数  预警率  未处理
              if (JSON.stringify(recordData) !== '{}') {
                // 遍历numData
                for (var k in numData) { // self.items.push(results.list[i])
                  if (numData[k].length !== 0) {
                    itemObj.date = k.replace('-', '年').replace('-', '月') + '日'
                    itemObj.num_data = ''
                    itemObj.num_data = numData[k][0]
                    itemObj.warning_data = ''
                    itemObj.warning_data = numData[k][0] - warningData[k][0]
                    itemObj.rate_data = ''
                    itemObj.rate_data = Math.floor(((numData[k][0] - warningData[k][0]) / numData[k][0]) * 100) + '%'
                    itemObj.deal_data = ''
                    itemObj.deal_data = (numData[k][0] - warningData[k][0]) - (numData[k][0] - dealData[k][0])
                    itemObj.ids_data = ''
                    itemObj.ids_data = idsData[k].join(',')
                    itemObj.record_data = k
                    console.log(itemObj.ids_data, 'ids字符串')
                    self.items.push(itemObj)
                    itemObj = {ids_data: '', orgId: this.$route.query.org_id}
                  }
                  var year = self.items[0].date.split('年')[0]
                  var month = self.items[0].date.split('年')[1].split('月')[0]
                  // if (month < 10) {
                    // month = '0' + month
                  // }
                  var day = self.items[0].date.split('年')[1].split('月')[1].split('日')[0]
                  // if (day < 10) {
                    // day = '0' + day
                  // }
                  var date = year + '-' + month + '-' + day
                  this.$store.state.behavior.timer = date
                  console.log(this.$store.state.behavior.timer, '时间')   // 20170512
                  console.log(self.items, '数组')
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
              if (self.touchRefresh) {
                self.touchRefresh.recover()
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
      getScroll: function (event) {
        window.$.stationArr.push(document.body.scrollTop)
        this.$store.state.behavior.schoolArr = this.items
      },
      prev: function (event) {
        this.$router.go(-1)
        console.log('go back')
      }
    }
  }

</script>
