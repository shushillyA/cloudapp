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
            <p class='name'>{{student.realname}}</p>
            <p class='class'>{{student.classname.fullName}}</p>
          </section>
      </div> 
    </div>
    <div class='loading' v-if='loading'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    /*个人信息*/
    & .content{
      width:100%;
      height:100%;
      margin-top: -2rem;
      & .class{
        float:left;
        font-size:1.6rem;
        color:#bdc0c7;
        line-height:3rem;
      }
      & .name{
        float:left;
        font-size:1.8rem;
        color:#6c7079;
        margin-right:1rem;
        line-height:3rem;
      }
    }
  }
   
</style>
<script>
import functions from '../../functions'
export default {
  name: 'searchstu',
  created () {
    window.back = this.prev
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '选择学生' })
      this.$invoke('showButton', { text: '' })
    } catch (e) {

    }
    this.$nextTick(function () { // 进入页面时input输入框聚焦
      document.getElementById('input').focus()
    })
  },
  data () {
    return {
      searchStu: [],
      resultShow: false,
      input: '',
      temps: [],
      tempShow: false,
      loading: false,
      key: null
    }
  },
  methods: {
    renderData: function (key) {
      // var url = 'v1/record/search-student-no-record.api?access_token='
      var url = `${functions.getURL('record/search-student-no-record')}?access_token=`
      var self = this
      self.loading = true
      var token = functions.getParam('token')
      self.searchStu = []
      if (key) {
        console.log(key)
        url = url + token + '&keyword=' + key
      } else {
        url = url + token + '&keyword='
      }
      // 渲染数据
      window.$.jsonp(url, function (obj) {
        var results = obj.data.list
        // dataList = results
        console.log(results)
        if (Array.isArray(results)) {
          if (results.length > 0) {
            self.resultShow = false
            var stuObj = {realname: '', username: '', class_name: ''}
            for (var i = 0; i < results.length; i++) {
              // console.log(results[i].realname + '  ' + results[i].username + '  ' + results[i].class_name)
              stuObj.realname = results[i].realname
              stuObj.classname = results[i].classname
              stuObj.user_id = results[i].id
              self.searchStu.push(stuObj)
              stuObj = []
            }
            if (self.searchStu.length > 0) {
              self.loading = false
            }
          } else {
            self.resultShow = true
            self.loading = false
          }
        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    searchData: function (key) {
      // var url = 'v1/record/search-student-no-record.api?access_token='
      var url = `${functions.getURL('record/search-student-no-record')}?access_token=`
      var self = this
      self.temps = []
      var token = functions.getParam('token')
      url = url + token + '&keyword=' + key
      console.log(url)
      window.$.jsonp(url, function (obj) {
        var results = obj.data.list
        try {
          if (Array.isArray(results)) {
            for (var k = 0; k < results.length; k++) {
              if (results[k].realname.indexOf(key) !== -1) {
                if (self.temps.indexOf(results[k].realname) === -1) {
                  self.temps.push(results[k].realname)
                }
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
    search: function (event) {
      event.preventDefault()
      this.key = this.$refs.input1.value
      console.log(this.key)
      this.loading = true
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
        this.tempShow = true
        this.searchData(e.target.value)
        this.searchStu = []
      } else {
        this.tempShow = false
      }
      console.log(this.temps)
    },
    clear: function () {
      this.input = ''
      this.tempShow = false
    },
    choose: function (student) {
      console.log(student)
      // var params = JSON.parse(window.localStorage.getItem('recordParams'))
      // var params = this.$store.state.record.recordParams
      var params = this.$store.state.record
      params.id = student.user_id
      params.realname = student.realname + ''
      console.log(params)
      // window.localStorage.setItem('recordParams', JSON.stringify(params))
      this.$store.state.record.recordParams = params
      this.$router.go(-1)
    },
    select: function (temp) {
      this.input = temp
      this.tempShow = false
      this.key = temp
      this.renderData(temp)
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
