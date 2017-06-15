<template>
  <div id="searchTest" class="wrap">
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="" v-on:click = 'searchWarn($event)'>
        <form action='' v-on:submit='searchWarn($event)'>
          <input id="input" class='WarnS_input' type="search" placeholder="搜索活动" name='search' value= ''   @input="change($event)" v-model='searchVal'
                 onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" autocomplete="off">
        </form>
        <img id="cancel_img" src="../../assets/cancel.png" alt="" v-on:click = 'clear' v-show="searchVal.length > 0">
      </section>
    </div>
    <div class='searchTemp' v-if='tempShow'>
      <section class='shell' v-for='temp in temps' v-on:click='select(temp)'>
        <img src='../../assets/search_blue.png'><span>【{{temp.type}}】</span> <p>{{temp.name}}</p>
      </section>
    </div>
    <div v-if='resultShow' id='noContent'>
      <img src='../../assets/logo_no.png'>
      <p>暂无内容</p>
    </div>
    <section class='shell titleShell' v-if='titleShow'>
      <ul>
        <li>
          <div :class="{cur_text: type ==='用户', un_text: type !=='用户' }" v-on:click="changeTab(1)">用户</div>
          <div :class="{cur_bor: type ==='用户', un_bor: type !=='用户' }"></div>
        </li>
        <li>
          <div :class="{cur_text: type ==='活动', un_text: type !=='活动' }" v-on:click="changeTab(2)">活动</div>
          <div :class="{cur_bor: type ==='活动', un_bor: type !=='活动' }"></div>
        </li>
      </ul>
    </section>
    <div id="pull-header"><section>刷新中...</section></div>
    <div class='content' v-on:refresh="refresh" v-on:append="append">
      <section class="shell" v-for="msg in searchmsgs" v-on:click='findResult(msg)'>
        <div class="type_detail">
          <div class="search_name" v-if='msg.type==="用户"'>
            <img v-if='msg.warning_level==="0"' src='../../assets/warnSign1.png'>
            <img v-if='msg.warning_level==="1"' src='../../assets/warnSign2.png'>
            <img v-if='msg.warning_level==="2"' src='../../assets/warnSign3.png'>
            <img v-if='msg.warning_level==="3"' src='../../assets/warnSign.png'>
            <div class="name">{{msg.name}}</div>
            <div class="class">{{msg.class_name}}</div>
          </div>
          <div class="search_activity" v-if='msg.type==="活动"'>
            <span></span>
            <div>{{msg.act_name}}</div>
          </div>
        </div>
      </section>
    </div>
    <div class='loading' v-if='loadingShow'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
    <div id="pull-footer"><section>加载中...</section></div>
  </div>
</template>
<style lang='postcss' scoped>
.wrap{
  & .searchTemp{
    & span{
      color: #c2c3d8;
      float:left;
      margin-right: 0.8rem;
    }
    & p{
      width:68%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  & .titleShell{
    margin-top:-2.2rem;
    & ul{
      width: 100%;
      background-color: #fff;
      & li{
        float: left;
        width: 50%;
        height: 3rem;
        line-height: 3rem;
        text-align: center;
        & .cur_text{
          height: 2.5rem;
          font-size: 1.8rem;
          color: #3dbfff;
          font-family: 'Microsoft YaHei';
        }
        & .un_text{
          height: 2rem;
          font-size: 1.8rem;
          color:#c2c3d8;
          font-family:'Microsoft YaHei UI';
        }
        & .cur_bor{
          width: 22%;
            border-bottom-style: solid;
            border-bottom-width: 3px;
            border-bottom-color: #3dbfff;
            margin: 1.3rem auto;
        }
        & .un_bor{
          border-bottom-style:solid;
          border-bottom-width:0;
          border-bottom-color:#3dbfff;
        }
      }
    }
  }
  & #pull-header {
    margin-top: 2rem;
  }
  & .content{
    width:100%;
    height:100%;
    position:relative;
    margin-top: -0.8rem;
    & .type_detail{
      width:100%;
      background-color:#fff;
      & .search_name{
        height:4rem;
        background-color: #ffffff;
        & img{
          float: left;
          margin-right: 1rem;
          margin-top: 0.7rem;
          width: 2.6rem;
        }
        & .name{
          float: left;
          width: 30%;
          height: 2rem;
          line-height: 2rem;
          text-align: left;
          font-size: 1.8rem;
          color: #6c7079;
          margin-top: 1rem;
          margin-left: 1rem;
          overflow:hidden;
        }
        & .class{
          float: left;
          width: 30%;
          height: 2rem;
          line-height: 2rem;
          text-align: left;
          font-size: 1.6rem;
          color: #bdc0c7;
          margin-top: 1rem;
          margin-left: 0.5rem;
          overflow:hidden;
        }
      }
      & .search_activity{
        & span{
          display: inline-block;
          width: 1.2rem;
          height: 1.2rem;
          background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
          box-shadow: 0 0 0.5rem #56dcf9;
          border-radius: 0.5rem;
          margin-right: 1rem;
          float: left;
          margin-top: 0.9rem;
        }
        & div{
          float: left;
          height: 3rem;
          line-height: 3rem;
          text-align: left;
          font-size: 1.8rem;
          color: #6c7079;
          overflow:hidden;
        }
      }
    }
  }
}


</style>
<script>
import functions from '../../functions'
export default {
  name: 'searchwarn',
  data () {
    return {
      searchmsgs: [],
      input: '',
      searchVal: '',
      text: '',
      resultShow: false,
      tempShow: false,
      temps: [],
      loadingShow: false,
      type: '用户',
      titleShow: false,
      touchRefresh: null,
      page: 1,
      dataObj: {type: '', name: ''}
    }
  },
  created () {
    var warnState = this.$route.params.warnState
    this.page = this.$store.state.page
    this.count = this.$store.state.count
    this.pageSize = this.$store.state.pageSize
    console.log('page' + this.page)
    if (warnState === false) {
      this.$nextTick(function () { // 进入页面时input输入框聚焦
        document.getElementById('input').focus()
        this.searchVal = ''
      })
    } else {
      console.log('append' + this.searchmsgs)
      this.searchmsgs = this.$store.state.warning.storageArr
      this.$nextTick(function () {
        document.getElementById('input').blur()
        this.loadingShow = false
        this.searchVal = this.$store.state.key
        this.titleShow = true
        this.type = this.$store.state.warning.searchType
        document.body.scrollTop = window.$.stationArr.pop()
      })
    }
    window.back = this.prev
    try {
      this.$invoke('toggleNavigation', { isShow: false }) // 显示返回  隐藏底部
      this.$invoke('setTitle', { title: '我的预警' })
    } catch (e) {

    }
  },
  mounted () {
    this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
  },
  methods: {
    renderData: function (url, append = false) {
      var self = this
      this.$store.state.page = this.page
      var token = functions.getParam('token')
      var sendData
      if (self.type === '用户') {
        sendData = {
          access_token: token,
          'so[user_name]': this.searchVal,
          page: this.page
        }
      } else if (self.type === '活动') {
        sendData = {
          access_token: token,
          'so[act_name]': this.searchVal,
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
          if (!append) {
            self.searchmsgs = []
            self.storage = []
          }
          var results = obj.data.data
          this.$store.state.count = results.count
          this.$store.state.pageSize = results.page_size
          if (Array.isArray(results.list)) {
            if (results.list.length > 0) {
              self.resultShow = false
              for (var i = 0; i < results.list.length; i++) {
                if (self.type === '用户') {
                  results.list[i]['type'] = '用户'
                } else if (self.type === '活动') {
                  results.list[i]['type'] = '活动'
                }
                results.list[i].class_name = results.list[i].class_name.fullName
                self.searchmsgs.push(results.list[i])
              }
              if (self.searchmsgs.length > 0) {
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
          window.$.invoke('showMessage', { message: '网络请求失败' })
        })
    },
    refresh: function () {
      console.log('refresh')
      this.page = 1
      if (this.type === '用户') {
        this.renderData('warning/user-search')
      } else if (this.type === '活动') {
        this.renderData('warning/act-search')
      }
    },
    append: function () {
      if (this.page < Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        this.page++
        if (this.type === '用户') {
          this.renderData('warning/user-search', true)
        } else if (this.type === '活动') {
          this.renderData('warning/act-search', true)
        }
        console.log('asdf')
        console.log(this.page)
      } else if (this.page === Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
        this.$invoke('showMessage', {message: '没有更多数据'})
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }
      console.log('state' + this.page)
    },
    searchWarn: function (event) {
      this.page = 1
      event.preventDefault()
      this.tempShow = false
      this.titleShow = true
      this.loadingShow = true
      this.key = this.searchVal
      if (this.type === '用户') {
        this.renderData('warning/user-search')
      } else if (this.type === '活动') {
        this.renderData('warning/act-search')
      }
      this.$store.state.key = this.searchVal
      this.$nextTick(function () { // 搜索完成后input输入框失去焦点
        document.getElementById('input').blur()
      })
      console.log('测试')
    },
    searchData: function (url, searchname) { // 模糊查询 自动匹配
      var self = this
      var token = functions.getParam('token')
      var sendData
      if (searchname === 'name') {
        sendData = {
          access_token: token,
          'so[user_name]': this.searchVal,
          page: this.page
        }
      } else if (searchname === 'act_name') {
        sendData = {
          access_token: token,
          'so[act_name]': this.searchVal,
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
          if (Array.isArray(results.list)) {
            for (var k = 0; k < results.list.length; k++) {
              self.dataObj = {} // 解决push进数组的一直都是最后一个数据的问题
              if (results.list[k][searchname].indexOf(self.searchVal) !== -1) {
                if (searchname === 'name') {
                  self.dataObj.type = '用户'
                } else if (searchname === 'act_name') {
                  self.dataObj.type = '活动'
                }
                self.dataObj.name = results.list[k][searchname]
                self.temps.push(self.dataObj)
                var hash = {} // 对数组里的对象去重
                self.temps = self.temps.reduce(function (item, next) {
                  hash[next.name] ? '' : hash[next.name] = true && item.push(next)
                  return item
                }, [])
              }
            }
            console.log(self.temps)
          }
        }, function () {
          window.$.invoke('showMessage', { message: '网络请求失败' })
        })
    },
    select: function (temp) {
      this.searchVal = temp.name
      this.tempShow = false
      this.titleShow = true
      this.loadingShow = true
      this.page = 1
      this.type = temp.type
      if (temp.type === '用户') {
        this.renderData('warning/user-search')
      } else if (temp.type === '活动') {
        this.renderData('warning/act-search')
      }
      this.$store.state.key = temp.name
      this.$store.state.warning.searchType = temp.type
    },
    findResult: function (msg) {
      this.$store.state.warning.storageArr = this.searchmsgs
      this.$store.state.page = this.page
      console.log(this.$store.state.warning.storageArr)
      window.$.stationArr.push(document.body.scrollTop)
      this.$store.state.warning.searchType = this.type
      this.$router.push({path: '/warning/new', query: {user_id: msg.user_id, status: true}})
      this.$router.go(1)
    },
    clear: function () {
      this.searchVal = ''
      this.tempShow = false
    },
    prev: function (event) {
      this.$nextTick(function () { // 进入搜索界面不搜索直接返回时input输入框失去焦点，收起软键盘
        document.getElementById('input').blur()
      })
      this.$router.go(-1)
      console.log('go back')
    },
    change: function (e) {
      this.temps = []
      this.titleShow = false
      this.resultShow = false
      this.searchmsgs = []
      if (e.target.value) {
        this.tempShow = true
        this.searchData('warning/user-search', 'name')
        this.searchData('warning/act-search', 'act_name')
        // this.searchmsgs = []
      } else {
        this.tempShow = false
      }
    },
    changeTab: function (sign) {
      this.page = 1
      this.searchmsgs = []
      this.loadingShow = true
      this.resultShow = false
      if (sign === 1) {
        this.type = '用户'
        this.renderData('warning/user-search')
      } else if (sign === 2) {
        this.type = '活动'
        this.renderData('warning/act-search')
      }
      this.$store.state.warning.searchType = this.type
    }
  }
}
</script>
