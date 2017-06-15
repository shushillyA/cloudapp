<template>
  <div>
    <div class="wrap">
      <div class="search">
        <section>
          <img id="search_img" src="../../assets/search.png" alt="" v-on:click='search($event)'>
          <form action='' v-on:submit='search($event)'>
            <input id='input' type="search" placeholder="搜索用户、活动、量表" ref='input1' @input="change($event)" onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')"
              autocomplete="off" v-model='input'>
          </form>
          <img id="cancel_img" src="../../assets/cancel.png" alt="" v-show='input.length > 0' v-on:click='clear($event)'>
        </section>
      </div>
      <section class="shell titleShell" v-if='titleShow'>
        <ul>
          <li>
            <div :class="{cur_text: search_type==='用户', un_text: search_type!=='用户'}" v-on:click="changeList(1)">用户</div>
            <div :class="{cur_bor: search_type==='用户', un_bor: search_type!=='用户'}"></div>
          </li>
          <li>
            <div :class="{cur_text: search_type==='活动', un_text: search_type!=='活动'}" v-on:click="changeList(2)">活动</div>
            <div :class="{cur_bor: search_type==='活动', un_bor: search_type!=='活动'}"></div>
          </li>
          <li>
            <div :class="{cur_text: search_type==='量表', un_text: search_type!=='量表'}" v-on:click="changeList(3)">量表</div>
            <div :class="{cur_bor: search_type==='量表', un_bor: search_type!=='量表'}"></div>
          </li>
        </ul>
      </section>
      <div class='searchTemp' v-if='tempShow'>
        <section class='shell' v-for='temp in temps' v-on:click='select(temp)'>
          <img src='../../assets/search_blue.png'><span>【{{temp.type}}】</span>
          <p>{{temp.name}}</p>
        </section>
      </div>
      <div v-if='resultShow' id='noContent'>
        <img src='../../assets/logo_no.png'>
        <p>暂无内容</p>
      </div>
      <div id="pull-header">
        <section>刷新中...</section>
      </div>
      <div class="content" v-on:refresh="refresh" v-on:append="append">
        <section class="shell actShell" v-for="msg in searchmsgs" v-on:click='findResult(msg)' v-if='search_type==="活动"'>
          <div v-if='msg.type==="活动"'>
            <p>{{msg.ce_type}}</p>
            <p>{{msg.title}}</p>
          </div>
        </section>
        <section class='shell userShell' v-for='msg in searchmsgs' v-on:click='findResult(msg)' v-if='search_type==="用户"'>
          <div v-if='msg.type==="用户"'>
            <p class='type_student' v-if='msg.user_type==="学生"'>{{msg.user_type}}</p>
            <p class='type_parent'v-if='msg.user_type==="家长"'>{{msg.user_type}}</p>
            <p class='type_teacher'v-if='msg.user_type==="老师"'>{{msg.user_type}}</p>
            <p>{{msg.user_name}}</p>
            <p>{{msg.user_class}}</p>
            <!--<p>{{msg.user_class.fullName}}</p>-->
          </div>
        </section>
        <section class='shell scaleShell' v-for='msg in searchmsgs' v-on:click='findResult(msg)' v-if='search_type==="量表"'>
          <div v-if='msg.type==="量表"'>
            <p>{{msg.scale_name}}</p>
          </div>
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
<style lang='postcss' scoped>
  .wrap {
    width: 100%;
    height: 100%;
    & .titleShell {
      margin-top: -2.2rem;
      & ul {
        width: 100%;
        height: 3rem;
        line-height: 3rem;
        font-size: 1.6rem;
        color: #6c7079;
        & li {
          float: left;
          width: 33%;
          text-align: center;
          height: 3rem;
          line-height: 3rem;
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
          width: 30%;
          border-bottom-style: solid;
          border-bottom-width: 3px;
          border-bottom-color: #3dbfff;
          margin: 0.8rem auto;
        }
        & .un_bor {
          border-bottom-style: solid;
          border-bottom-width: 0;
          border-bottom-color: #5dbfdf;
        }
      }
    }
    & .searchTemp {
      & span {
        color: #c2c3d8;
        float: left;
        margin-right: 0.8rem;
      }
      & p {
        width: 68%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    & #pull-header {
      margin-top: 2rem;
    }
    & .content {
      width: 100%;
      height: 100%;
      position: relative;
      margin-top: -0.8rem;

      &. atcShell {
        & div {
          height: 3rem;
          background-color: #ffffff;
          & p:nth-child(1) {
            float: left;
            width: 3rem;
            height: 3rem;
            line-height: 3rem;
            background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#38b7ff), to(#02d4ff));
            text-align: center;
            border-radius: 1.5rem;
            color: #fff;
            font-size: 1.8rem;
            margin-right: 1rem;
          }
          & p:nth-child(2) {
            float: left;
            width: 60%;
            height: 3rem;
            line-height: 3rem;
            text-align: left;
            font-size: 1.8rem;
            color: #6c7079;
            overflow: hidden;
          }
        }
      }

      & .userShell {
        & div {
          & p:nth-child(1) {
            float: left;
            width: 14%;
            height: 2.2rem;
            border-radius: 1.1rem;
            color: #ffffff;
            font-size: 1.4rem;
            text-align: center;
            line-height: 2.2rem;
            margin-top: 0.4rem;
          }
          & .type_student {
            background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#38b8ff), to(#02d3ff));
          }
            & .type_parent {
              background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ff5cb4), to(#ff75a4));
            }
            & .type_teacher {
              background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#04c98a), to(#46e7a2));
            }
          & p:nth-child(2) {
            float: left;
            height: 3rem;
            line-height: 3rem;
            font-size: 1.8rem;
            color: #6c7079;
            margin: 0 1rem;
            width: 34%;
            overflow: hidden;
          }
          & p:nth-child(3) {
            float: left;
            height: 3rem;
            line-height: 3rem;
            font-size: 1.6rem;
            color: #bdc0c7;
          }
        }
      }

      & .scaleShell {
        & div {
          height: 3rem;
          line-height: 3rem;
          font-size: 1.8rem;
          color: #6c7079;
          overflow: hidden;
        }
      }
    }
  }
</style>
<script>
  import functions from '../../functions'
  export default {
    name: 'searchevaluation',
    data () {
      return {
        searchmsgs: [],
        resultShow: false,
        input: '',
        loadingShow: false,
        search_type: '用户',
        titleShow: false,
        tempShow: false,
        temps: [],
        touchRefresh: null,
        page: 1,
        dataObj: { type: '', name: '' }
      }
    },
    created () {
      this.page = this.$store.state.page
      this.count = this.$store.state.count
      this.pageSize = this.$store.state.pageSize
      window.back = this.prev
      try {
        window.$.invoke('toggleNavigation', { isShow: false })
        window.$.invoke('setTitle', { title: '测评' })
      } catch (e) {

      }
    },
    mounted () {
      this.touchRefresh = window.touchRefresh(document.querySelector('.content'), { header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer') })
      var evalState = this.$route.params.evalState
      if (evalState === false) {
        this.$nextTick(function () { // 进入页面时input输入框聚焦
          document.getElementById('input').focus()
        })
        this.input = ''
        this.page = 1
      } else {
        this.searchmsgs = this.$store.state.searchEvaluationArr
        this.loadingShow = false
        this.titleShow = true
        this.search_type = this.$store.state.evaluation.searchEvalType
        this.input = this.$store.state.key
        document.getElementById('input').blur()
      }
    },
    updated () {
      if (this.$store.state.evaluation.evalStationY.length !== 0) {
        this.$nextTick(function () {
          document.body.scrollTop = this.$store.state.evaluation.evalStationY.pop()
        })
      }
    },
    methods: {
      renderData: function (url, append = false) {
        var self = this
        var token = functions.getParam('token')
        var sendData
        if (this.search_type === '用户') { // 搜索时tab样式的切换
          sendData = {
            access_token: token,
            'so[user_name]': this.input,
            page: this.page
          }
        } else if (self.search_type === '活动') {
          sendData = {
            access_token: token,
            'so[act_name]': this.input,
            page: this.page
          }
        } else if (self.search_type === '量表') {
          sendData = {
            access_token: token,
            'scale_name': this.input,
            page: this.page
          }
        }
        this.$http.jsonp(
          functions.getURL(url),
          {
            params: sendData
          }).then(
            function (obj) {
              console.log(obj, '收到的数据数据更改')
              var results = obj.data.data
          // var results = obj.data.activity_data
              console.log(url)
              self.$store.state.pageSize = results.page_size
              self.$store.state.count = results.count
              if (!append) {
                self.searchmsgs = []
                // storage = []
              }
              if (Array.isArray(results.list)) {
                if (results.list.length > 0) {
                  self.resultShow = false
                  for (var i = 0; i < results.list.length; i++) {
                    // dataList = results.list
                    var activityList = results.list[i]
                    if (activityList.user_type) {
                      if (parseInt(activityList.user_type) === 1) {
                        activityList.user_type = '学生'
                      } else if (parseInt(activityList.user_type) === 2) {
                        activityList.user_type = '家长'
                      } else if (parseInt(activityList.user_type) === 3) {
                        activityList.user_type = '老师'
                      }
                    }
                    if (activityList.ce_type) {
                      if (activityList.ce_type === '0') {
                        activityList.ce_type = '普'
                      } else if (activityList.ce_type === '1') {
                        activityList.ce_type = '个'
                      }
                    }
                    if (activityList.title) {
                      var maxStr = 10
                      if (activityList.title.length > maxStr) {
                        activityList.title = activityList.title.substr(0, 10) + '...'
                      }
                    }
                    if (activityList.scale_name) {
                      if (activityList.scale_name.length > maxStr) {
                        activityList.scale_name = activityList.scale_name.substr(0, 10) + '...'
                      }
                    }
                    if (self.search_type === '用户') {
                      results.list[i]['type'] = '用户'
                    } else if (self.search_type === '活动') {
                      results.list[i]['type'] = '活动'
                    } else if (self.search_type === '量表') {
                      results.list[i]['type'] = '量表'
                    }
                    self.searchmsgs.push(activityList)
                  }
                  console.log(self.searchmsgs)
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
        if (this.search_type === '用户') {
          this.renderData('activity/user-search')
        } else if (this.search_type === '活动') {
          this.renderData('activity/search')
        } else if (this.search_type === '量表') {
          this.renderData('activity/scale-search')
        }
      },
      append: function () {
        console.log('append')
        if (this.page < Math.ceil(this.$store.state.count / this.$store.state.pageSize)) {
          this.page++
          if (this.search_type === '用户') {
            this.renderData('activity/user-search', true)
          } else if (this.search_type === '活动') {
            this.renderData('activity/search', true)
          } else if (this.search_type === '量表') {
            this.renderData('activity/scale-search', true)
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
        this.page = 1
        this.searchmsgs = []
        this.loadingShow = true
        this.resultShow = false
        // key = this.input
        if (sign === 1) {
          this.search_type = '用户'
          this.renderData('activity/user-search')
        } else if (sign === 2) {
          this.search_type = '活动'
          this.renderData('activity/search')
        } else if (sign === 3) {
          this.search_type = '量表'
          this.renderData('activity/scale-search')
        }
        this.$store.state.evaluation.searchEvalType = this.search_type
      },
      search: function (event) {
        this.titleShow = true
        this.loadingShow = true
        this.tempShow = false
        event.preventDefault()
        this.page = 1
        if (this.search_type === '用户') {
          this.renderData('activity/user-search')
        } else if (this.search_type === '活动') {
          this.renderData('activity/search')
        } else if (this.search_type === '量表') {
          this.renderData('activity/scale-search')
        }
        this.$store.state.key = this.input
        this.$store.state.evaluation.searchEvalType = this.search_type
        this.$nextTick(function () { // 搜索完成后input输入框失去焦点
          document.getElementById('input').blur()
        })
      },
      searchData: function (url, searchname) {
        var self = this
        var token = functions.getParam('token')
        var sendData
        if (searchname === 'user_name') {
          sendData = {
            access_token: token,
            'so[user_name]': this.input
          }
        } else if (searchname === 'title') {
          sendData = {
            access_token: token,
            'so[act_name]': this.input
          }
        } else if (searchname === 'scale_name') {
          sendData = {
            access_token: token,
            'scale_name': this.input
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
              try {
                if (Array.isArray(results.list)) {
                  for (var k = 0; k < results.list.length; k++) {
                    self.dataObj = {} // 解决push进数组的一直都是最后一个数据的问题
                    if (results.list[k][searchname].indexOf(this.input) !== -1) {
                      if (searchname === 'user_name') {
                        self.dataObj.type = '用户'
                      } else if (searchname === 'title') {
                        self.dataObj.type = '活动'
                      } else if (searchname === 'scale_name') {
                        self.dataObj.type = '量表'
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
              } catch (e) {

              }
            }
          )
      },
      select: function (temp) {
        this.input = temp.name
        console.log(this.searchVal)
        this.tempShow = false
        this.titleShow = true
        this.loadingShow = true
        // key = temp.name
        this.page = 1
        this.search_type = temp.type
        if (temp.type === '用户') {
          this.renderData('activity/user-search')
        } else if (temp.type === '活动') {
          this.renderData('activity/search')
        } else if (temp.type === '量表') {
          this.renderData('activity/scale-search')
        }
        this.$store.state.key = temp.name
        this.$store.state.evaluation.searchEvalType = temp.type
      },
      findResult: function (msg) {
        this.$store.state.searchEvaluationArr = this.searchmsgs
        this.$store.state.evaluation.searchEvalType = this.search_type
        this.$store.state.evaluation.scale_id = msg.scale_id
        this.$store.state.page = this.page
        this.$store.state.evaluation.evalStationY.push(document.body.scrollTop)
        console.log(this.$store.state.evaluation.evalStationY, 'push')
        if (this.search_type === '用户') {
          this.getDetail(msg, msg.activity_id)
        } else if (this.search_type === '活动') {
          this.getDetail(msg, msg.id)
        } else if (this.search_type === '量表') {
          this.getDetail(msg, msg.activity_id)
        }
      },
      getDetail: function (msg, actId) { // 搜索页进入详情内页
        this.$router.push({ path: '/evaluation/', query: { act_id: actId, user_id: msg.user_id, status: true, type: this.search_type } })
        this.$router.go(1)
      },
      clear: function () {
        this.input = ''
        // key = ''
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
        this.searchmsgs = []
        this.titleShow = false
        this.resultShow = false
        console.log(e.target.value)
        if (e.target.value) {
          this.tempShow = true
          this.searchData('activity/user-search', 'user_name')
          this.searchData('activity/search', 'title')
          this.searchData('activity/scale-search', 'scale_name')
          this.searchmsgs = []
        } else {
          this.tempShow = false
        }
      }
    }
  }

</script>
