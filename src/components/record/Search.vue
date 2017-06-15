<template>
  <div class='wrap'>
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <form v-on:submit='search($event)'>
          <input id='input' type="search" placeholder="搜索用户" ref='input1' @input="change($event)"
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
    <div class='content'>
      <div v-for='student in searchStu'>
          <section class='shell' v-on:click='choose(student)'>
            <p class='name1'>{{student.realname}}</p>
            <p class='class1'>{{student.classname}}</p>
          </section>
      </div>
      <div class='loading' v-if='loading'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  /*缺省页面*/
  #noContent{
    width: 40%;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-100%);
    & p{
      font-size:2rem;
      color:#cdcdd6;
    }
    & img{
      width:7rem;
    }
  }
  /*数据加载成功前的动画显示*/
  .search{
    width: 100%;
      height: 10rem;
      text-align: center;
      padding: 5% 2% 4% 2%;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
  }
  /*个人信息*/
  .content{
    width:100%;
    height:100%;
    margin-top: -2.2rem;
    position:relative;
    & .name1{
      float:left;
      font-size:1.8rem;
      color:#6c7079;
      margin-right:1rem;
      line-height:3rem;
    }
    & .class1{
      float:left;
      font-size:1.6rem;
      color:#bdc0c7;
      line-height:3rem;
    }
    & .loading{
      width: 40%;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,200%);
      & img{
        width:7rem;
      }
    }
  }
  
  
</style>
<script>
import functions from '../../functions'
// var SEARCHSTU_URL = 'https://cloudappapi.test.xlhb.com/v1/record/search-student.api?access_token='
// var dataList = null
// var storage = []
export default {
  name: 'searchstu',
  created () {
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '搜索列表' })
      window.$.invoke('showButton', { text: 'GONE' })
    } catch (e) {
    }
    // var state = this.$route.params.recordSearch
    // console.log(state)
    console.log(window.$.stationArr.length)
    if (window.$.stationArr.length === 0) {
      this.$nextTick(function () { // 进入页面时input输入框聚焦
        document.getElementById('input').focus()
      })
      this.searchStu = []
      // window.localStorage.removeItem('recordKey')
      this.$store.state.record.recordKey = null
    } else {
      // var recordSearchTemp = JSON.parse(window.localStorage.getItem('recordSearchTemp'))
      this.searchStu = this.$store.state.record.searchRecordArr
      console.log('this.dataList', '偶发')
      // this.input = window.localStorage.getItem('recordKey')
      this.input = this.$store.state.record.recordKey
      this.$nextTick(function () { // 进入页面时input输入框聚焦
        document.getElementById('input').blur()
        document.body.scrollTop = window.$.stationArr.pop()
      })
    }
  },
  data () {
    return {
      searchStu: [],
      resultShow: false,
      input: '',
      temps: [],
      tempShow: false,
      loading: false,
      key: null,
      dataList: [],
      storage: []
    }
  },
  methods: {
    renderData: function (key) {
      var url = 'https://cloudappapi.test.xlhb.com/v1/record/search-student.api?access_token='
      var self = this
      self.loading = true
      var token = functions.getParam('token')
      self.searchStu = []
      // storage = []
      if (key) {
        console.log(key)
        url = url + token + '&keyword=' + key
      } else {
        url = url + token + '&keyword='
      }
             // 渲染数据
      window.$.jsonp(url, function (obj) {
        console.log(obj, '收到的数据')
        var results = obj.data
        // self.dataList = results
        self.$store.state.dataList = results
        console.log(url)
        var dataObj = {realname: '', classname: '', user_id: ''}
        for (var key in results) {
          dataObj = {}
          dataObj.realname = results[key][0].realname
          dataObj.classname = results[key][0].classname
          dataObj.user_id = results[key][0].user_id
          self.searchStu.push(dataObj)
        }
        if (self.searchStu.length === 0) {
          self.resultShow = true
        } else {
          self.resultShow = false
        }
        self.loading = false
        console.log(self.searchStu)
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    searchData: function (key) {
      var url = 'https://cloudappapi.test.xlhb.com/v1/record/search-student.api?access_token='
      var self = this
      self.temps = []
      var token = functions.getParam('token')
      url = url + token + '&keyword=' + key
      console.log(url, '发送的地址')
      window.$.jsonp(url, function (obj) {
        console.log(obj, '收到的数据')
        var results = obj.data
        try {
          for (var k in results) {
            if (results[k][0].realname.indexOf(key) !== -1) {
              if (self.temps.indexOf(results[k][0].realname) === -1) {
                self.temps.push(results[k][0].realname)
              }
            }
          }
          console.log(self.temps)
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
      this.renderData(temp)
      // window.localStorage.setItem('recordKey', temp)
      this.$store.state.record.recordKey = temp
    },
    search: function (event) {
      event.preventDefault()
      this.key = this.$refs.input1.value
      console.log(this.key)
      this.loading = true
      // window.localStorage.removeItem('recordSearchTemp')
      this.$store.state.record.recordSearchTemp = []
      this.searchStu = []
      this.renderData(this.key)
      this.$nextTick(function () { // 搜索完成后input输入框失去焦点
        document.getElementById('input').blur()
      })
      this.tempShow = false
      // window.localStorage.setItem('recordKey', this.key)
      this.$store.state.record.recordKey = this.key
    },
    change: function (e) {
      this.resultShow = false
      if (e.target.value) {
        console.log(e.target.value)
        this.tempShow = true
        this.searchData(e.target.value)
        this.searchStu = []
      } else {
        this.tempShow = false
      }
    },
    clear: function () {
      this.input = ''
      this.tempShow = false
    },
    choose: function (student) {
      var params = this.$store.state.record.recordParams
      if (!params) {
        params = {id: null, realname: null, student: null, recordSign: null}
      }
      params.id = student.user_id
      params.realname = student.realname + ''
      params.student = student
      params.recordSign = true
      console.log(params)
      this.$store.state.record.recordParams = params
      this.$store.state.record.recordSign = false
      var studentTemp = []
      this.dataList = this.$store.state.dataList
      for (var key in this.dataList) {
        console.log(this.dataList[key])
        if (key.split('|')[1] === student.user_id) {
          for (var m = 0; m < this.dataList[key].length; m++) {
            console.log(this.dataList[key][m])
            studentTemp.push(this.dataList[key][m])
            // studentTemp.sort(function (a, b) {
            //   return Date.parse(b.created_time) - Date.parse(a.created_time) // 时间倒序
            // })
          }
        }
      }
      window.$.stationArr.push(document.body.scrollTop)
      this.$store.state.record.searchRecordArr = this.searchStu
      this.$router.push({path: '/record/detail/', query: {items: studentTemp}})
      this.$router.go(1)
    },
    prev: function (event) {
      this.$nextTick(function () { // 进入搜索界面不搜索直接返回时input输入框失去焦点，收起软键盘
        document.getElementById('input').blur()
      })
      console.log('go back')
      this.$router.go(-1)
    }
  }
}

</script>
