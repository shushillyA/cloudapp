<template>
  <div class='wrap'>
    <div  class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="" v-on:click='search($event)'>
        <form v-on:submit='search($event)'>
          <input id='input' type="search" placeholder="搜索用户" ref = 'input1' @input="change($event)"
                 onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" autocomplete="off" v-model='input'>
        </form>
        <img id="cancel_img" src="../../assets/cancel.png" alt="" v-show='input.length > 0' v-on:click='clear($event)'>
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
    <div id="pull-header" class="white">
      <section>刷新中...</section>
    </div>
    <div class='content' v-on:refresh="refresh" v-on:append="append">
      <div v-for='item in items'>
        <router-link :to="{ name: 'sandreport',  params: { report_id: item.report_id, sex: item.sex, name: item.name, class_name: item.class_name, age: item.age, create_time: item.create_time, costtime: item.costtime, report_no: item.report_no}}">
          <section class='shell' v-on:click='save'>
            <img v-if="item.sex==='女'" src='../../assets/male.png' class='male'>
            <img v-if="item.sex==='男'" src='../../assets/female.png' class='female'>
            <p class='name'>{{item.name}}</p>
            <p class='class'>{{item.class_name.fullName}}</p>
            <p class='number'>第<span>{{item.report_no}}</span>次</p>
          </section>
        </router-link>
      </div>
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
  .wrap{
    & .search{
      height:10rem;
    }
    & .content{
       width:100%;
        height:100%;
        margin-top: 0.5rem;
        position:relative;
        & .male{
          width: 1.2rem;
          height: 1.8rem;
          float: left;
          margin: 0.6rem 4% 0rem 1%;
        }
        & .female{
          width: 1.5rem;
          height: 1.5rem;
          float: left;
          margin: 0.75rem 2.5% 0rem 1%;
        }
        & .name{
          float:left;
          font-size:1.8rem;
          color:#6c7079;
          margin-right:1rem;
          line-height:3rem;
        }
        & .class{
          float:left;
          font-size:1.6rem;
          color:#bdc0c7;
          line-height:3rem;
        }
        & .number{
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



</style>
<script>
import functions from '../../functions'
export default {
  name: 'searchsandtable',
  data () {
    return {
      items: [],
      resultShow: false,
      input: '',
      temps: [],
      tempShow: false,
      loadingShow: false,
      key: '',
      touchRefresh: null,
      page: 1,
      count: 0,
      pageSize: 0
    }
  },
  created () {
    this.page = this.$store.state.page
    this.count = this.$store.state.count
    this.pageSize = this.$store.state.pageSize
    window.back = this.prev
    this.page = 1
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '沙盘' })
    } catch (e) {

    }
    this.$nextTick(function () {
      document.getElementById('input').focus()
    })
    var state = this.$route.params.sandSign
    console.log(state)
    if (state === false) {
      this.items = []
    } else {
      this.items = this.$store.state.sand.sandTemp
      this.input = this.$store.state.sand.sandKey
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
        functions.getURL('sand'),
        {
          params: sendData
        }).then(
          function (obj) {
            console.log(obj, '收到的数据')
            var results = obj.data.data
            self.count = results.count
            self.pageSize = results.page_size
            try {
              if (!append) {
                self.items = []
              }
              if (Array.isArray(results.list)) {
                if (results.list.length > 0) {
                  self.resultShow = false
                  for (var i = 0; i < results.list.length; i++) {
                    results.list[i].costtime = JSON.parse(results.list[i].weidu1).costtime
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
            } catch (e) {

            }
          }, function () {
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
    },
    refresh: function () {
      console.log('refresh')
      var self = this
      this.page = 1
      self.renderData()
    },
    append: function () {
      console.log('append')
      var self = this
      if (this.page < Math.ceil(this.count / this.pageSize)) {
        this.page++
        self.renderData(true)
      } else if (this.page === Math.ceil(this.count / this.pageSize)) {
        this.$invoke('showMessage', {message: '没有更多数据'})
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }
    },
    searchData: function (key) {
      var self = this
      self.temps = []
      self.resultShow = false
      this.$http.jsonp(functions.getURL('sand'), functions.sendParam({'username': key})).then(function (obj) {
        console.log(obj, '收到的数据')
        obj = obj.data
        var results = obj.data
        try {
          if (Array.isArray(results.list)) {
            for (var k = 0; k < results.list.length; k++) {
              if (results.list[k].name.indexOf(key) !== -1) {
                console.log(results.list[k].name)
                if (self.temps.indexOf(results.list[k].name) === -1) {
                  self.temps.push(results.list[k].name)
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
      this.key = temp
      this.renderData()
      // window.localStorage.setItem('sandKey', temp)
      this.$store.state.sand.sandKey = temp
    },
    search: function (event) {
      event.preventDefault()
      this.loadingShow = true
      this.renderData()
      this.$nextTick(function () { // 搜索完成后input输入框失去焦点
        document.getElementById('input').blur()
      })
      this.tempShow = false
      // window.localStorage.setItem('sandKey', this.key)
      this.$store.state.sand.sandKey = this.input
    },
    change: function (e) {
      this.items = []
      if (e.target.value) {
        this.tempShow = true
        this.searchData(e.target.value)
        this.items = []
      } else {
        this.tempShow = false
      }
    },
    clear: function (e) {
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
      this.$store.state.page = this.page
      this.$store.state.count = this.count
      this.$store.state.pageSize = this.page_size
      this.$store.state.sand.sandTemp = this.items
    }
  }
}
</script>
