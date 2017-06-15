<template>
  <div class='wrap'>
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="" v-on:click='search($event)'>
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
      <section class='shell' v-for='item in items'>
        <router-link
          :to="{name: 'cognitionreport', params: {user_id: item.user_id, realname: item.realname, class_name: item.class_name, finish: item.finish, last_warning_level: item.last_warning_level, clothbag_id: item.clothbag_num, solution_id: item.exercise_num, now_warning_level: item.now_warning_lvel}}">
          <div v-on:click = 'viewReport'>
             <img v-if="item.now_warning_lvel==='红色预警'" src='../../assets/warnSign.png' class='warnsign_img'>
            <img v-if="item.now_warning_lvel==='橙色预警'" src='../../assets/warnSign3.png' class='warnsign_img'>
            <img v-if="item.now_warning_lvel==='黄色预警'" src='../../assets/warnSign2.png' class='warnsign_img'>
            <img v-if="item.now_warning_lvel==='无预警'" src='../../assets/warnSign1.png' class='warnsign_img'>
            <p class='name'>{{item.realname}}</p>
            <p class='class'>{{item.class_name.fullName}}</p>
          </div>
        </router-link>
      </section>
    </div>
    <div class='loading' v-if='loadingShow'>
      <img src='../../assets/cloud_blue.gif'>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    & .search{
      height:10rem;
    }
    /*个人信息*/
& .content{
  width:100%;
  height:100%;
  margin-top: -2.5rem;
  position:relative;
  & img{
    float: left;
    width: 2rem;
    height: 2rem;
    margin-top: 0.6rem;
    margin-right: 0.5rem;
  }
  & .name{
    float:left;
    font-size:2rem;
    color:#6c7079;
    margin-right:1rem;
    line-height:3rem;
  }
  & .class{
    float:left;
    font-size:1.8rem;
    color:#bdc0c7;
    line-height:3rem;
  }
}

  }





</style>
<script>
import functions from '../../functions'
// var cogStorage = []
export default {
  name: 'searchcognition',
  created () {
    console.log(document.location)
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '认知' })
    } catch (e) {
    }
    this.$nextTick(function () { // 进入页面时input输入框聚焦
      document.getElementById('input').focus()
    })
    var state = this.$route.params.cogSign
    if (state === false) {
      this.items = []
    } else {
      this.items = this.$store.state.cognition.searchCogArr
      this.input = this.$store.state.key
      this.$nextTick(function () { // 进入页面时input输入框失去焦点
        document.getElementById('input').blur()
      })
      console.log(this.items)
    }
  },
  data () {
    return {
      items: [],
      resultShow: false,
      input: '',
      temps: [],
      tempShow: false,
      loadingShow: false
    }
  },
  mounted () {
    console.log(window.$.stationArr)
    this.$nextTick(function () { // 进入页面时input输入框失去焦点
      document.body.scrollTop = window.$.stationArr.pop()
    })
  },
  // watch: {// 监听输入框
  //   input: function (newVal) {
  //     this.searchData(SEARCHCOGNITION_URL, newVal)
  //     window.localStorage.setItem('cogKey', newVal)
  //   }
  // },
  methods: {
          // 渲染数据
    renderData: function () {
      var self = this
      var token = functions.getParam('token')
      var sendData = {
        access_token: token,
        realname: this.input
      }
      this.$http.jsonp(
        functions.getURL('cognize/user-search'),
        {
          params: sendData
        }).then(
          function (obj) {
            var results = obj.data.data
            try {
              self.items = []
              // cogStorage = []
              window.localStorage.removeItem('searchTemp')
              if (Array.isArray(results.cognize)) {
                if (results.cognize.length > 0) {
                  self.resultShow = false
                  for (var i = 0; i < results.cognize.length; i++) {
                    if (results.cognize[i].last_warning_level === '0') {
                      results.cognize[i].last_warning_level = '无'
                    } else if (results.cognize[i].last_warning_level === '1') {
                      results.cognize[i].last_warning_level = '黄'
                    } else if (results.cognize[i].last_warning_level === '2') {
                      results.cognize[i].last_warning_level = '橙'
                    } else if (results.cognize[i].last_warning_level === '3') {
                      results.cognize[i].last_warning_level = '红'
                    }
                    self.items.push(results.cognize[i])
                  }
                  if (self.items.length > 0) {
                    self.loadingShow = false
                  }
                } else {
                  self.resultShow = true
                  self.loadingShow = false
                }
                console.log(self.items)
              }
            } catch (e) {

            }
          }, function () {
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
    },
    searchData: function () {
      var self = this
      self.temps = []
      self.resultShow = false
      var token = functions.getParam('token')
      var sendData = {
        access_token: token,
        realname: this.input
      }
      this.$http.jsonp(
        functions.getURL('cognize/user-search'),
        {
          params: sendData
        }).then(
          function (obj) {
            console.log(obj, '收到的数据')
            var results = obj.data.data
            try {
              if (Array.isArray(results.cognize)) {
                for (var k = 0; k < results.cognize.length; k++) {
                  if (results.cognize[k].realname.indexOf(self.input) !== -1) {
                    console.log(results.cognize[k].realname)
                    if (self.temps.indexOf(results.cognize[k].realname) === -1) {
                      self.temps.push(results.cognize[k].realname)
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
      this.renderData()
      this.$store.state.key = temp
    },
    search: function (event) {
      event.preventDefault()
      this.loadingShow = true
      this.renderData()
      this.$nextTick(function () { // 搜索完成后input输入框失去焦点
        document.getElementById('input').blur()
      })
      this.tempShow = false
      this.$store.state.key = this.input
    },
    viewReport: function () {
      window.$.stationArr.push(document.body.scrollTop)
      this.$store.state.cognition.searchCogArr = this.items
    },
    change: function (e) {
      if (e.target.value) {
        this.tempShow = true
        this.searchData()
        this.items = []
      } else {
        this.tempShow = false
      }
    },
    clear: function (e) {
      this.input = ''
      this.tempShow = false
    },
    prev: function (event) {
      this.$nextTick(function () { // 进入搜索界面不搜索直接返回时input输入框失去焦点，收起软键盘
        document.getElementById('input').blur()
      })
      this.$router.go(-1)
      console.log('go back')
    }
  }
}

</script>
