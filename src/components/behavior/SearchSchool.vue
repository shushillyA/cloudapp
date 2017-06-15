<template>
  <div class='wrap'>
    <div class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <form v-on:submit='search($event)'>
          <input id='input' type="search" placeholder="学校名称" ref='input1' @input="change($event)"
                 onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" autocomplete="off" v-model='input'>
        </form>
        <div class='cancel_div' v-on:click='clear($event)'>
          <img id="cancel_img" src="../../assets/cancel.png" alt="" v-show='input.length > 0'>
        </div>
        <!--<img id="cancel_img" src="../../assets/cancel.png" alt="" v-show='input.length > 0' v-on:click='clear($event)'>-->
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
    <div id="pull-header" class="white"><section>刷新中...</section></div>
    <div class='content' @refresh="refresh" @append="append">
      <section class='shell' id='single' v-for='item in items'>
        <!--跳转页面 学校详情-->
          <div class='school' v-on:click='findDetail(item)'>
            <span>{{item.name}}</span>
            <!--<span>{{item.warning_count}}</span>-->
            <img src="../../assets/row.png" alt="">
          </div>
      </section>
      <div class='loading' v-if='loading'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
    </div>
    <div id="pull-footer"><section>加载中...</section></div>
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
    margin-top: 0.5rem;
    position:relative;
     & .shell{
        & .school {
          height:3rem;
          & span{
            line-height:3rem;
          }
          & span:nth-child(1){
            float: left;
            width: 78%;
            height:3rem;
            font-size: 1.8rem;
            color: #a5a6bb;
            margin: 0 0.6rem;
            overflow:hidden;
          }
          & span:nth-child(2){
            float: left;
            width: 10%;
            color: #3dbfff;
            font-size: 1.6rem;
            text-align: right;
          }
          & img{
            height:1rem;
            float:right;
            margin-top:1rem;
          }
        }
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
    console.log(this.$store.state.behavior.heightArr)
    if (this.$store.state.behavior.heightArr.length === 0) {
      this.$nextTick(function () { // 进入页面时input输入框聚焦
        document.getElementById('input').focus()
      })
      this.items = []
      // window.localStorage.removeItem('recordKey')
      this.$store.state.record.recordKey = null
    } else {
      // var recordSearchTemp = JSON.parse(window.localStorage.getItem('recordSearchTemp'))
      this.items = this.$store.state.behavior.behaviorTemp
      console.log('this.dataList', '偶发')
      // this.input = window.localStorage.getItem('recordKey')
      this.input = this.$store.state.behavior.behaviorKey
      this.$nextTick(function () { // 进入页面时input输入框聚焦
        document.getElementById('input').blur()
        document.body.scrollTop = this.$store.state.behavior.heightArr.pop()
      })
    }
  },
  mounted () {
    this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
  },
  data () {
    return {
      items: [],
      resultShow: false,
      input: '',
      temps: [],
      tempShow: false,
      loading: false,
      key: null,
      page: 1,
      pageSize: '',
      count: '',
      dataList: [],
      storage: []
    }
  },
  methods: {
    // 刷新菜单
    refresh: function () {
      this.page = 1
      this.search(event)
    },
    // 下拉菜单
    append: function () {
      // console.log(Math.ceil(this.count / this.pageSize))
      // if (this.page < Math.ceil(this.count / this.pageSize)) {
        // this.page++
        // console.log(this.page)
        // this.search(event, true)
      // } else if (this.page === Math.ceil(this.count / this.pageSize)) {
      this.$invoke('showMessage', {message: '没有更多数据'})
      if (this.touchRefresh) {
        this.touchRefresh.recover()
      }
      // }
    },
    searchData: function () {
      var sendData = {
        access_token: functions.getParam('token'),
        page: this.page,
        select_school_name: this.input
      }
      this.$http.jsonp(functions.getURL('edu-bwarning/list'), {params: sendData}).then(
        function (obj) {
          obj = obj.data
          this.temps = []
          for (var i = 0; i < obj.data.length; i++) {
            let behavior = obj.data[i]
            this.temps.push(behavior.name)
          }
        }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    select: function (temp) {
      this.input = temp
      this.tempShow = false
      this.key = temp
      this.search(event)
      // window.localStorage.setItem('recordKey', temp)
      this.$store.state.behavior.behaviorKey = temp
    },
    search: function (event, append = false) {
      event.preventDefault()
      this.loading = true
      // window.localStorage.removeItem('recordSearchTemp')
      if (!append) {
        this.items = []
      }
      var sendData = {
        access_token: functions.getParam('token'),
        page: this.page,
        select_school_name: this.input
      }
      this.$http.jsonp(functions.getURL('edu-bwarning/list'), {params: sendData}).then(
      function (obj) {
        obj = obj.data
        console.log(obj, '数据')
        try {
          if (!append) {
            self.items = []
          }
          this.count = obj.data.count
          this.pageSize = obj.data.page_size
          for (var i = 0; i < obj.data.length; i++) {
            let behavior = obj.data[i]
            this.area = obj.data[i].area_name
            console.log(obj.data[i].area_name, '迷你')
            this.items.push(behavior)
          }
          if (this.items.length === 0) {
            this.loading = false
            this.resultShow = true
          } else {
            this.loading = false
            this.resultShow = false
          }
        } catch (e) {

        }
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }, function () {
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      })
      this.$nextTick(function () { // 搜索完成后input输入框失去焦点
        document.getElementById('input').blur()
      })
      this.tempShow = false
      this.$store.state.behavior.behaviorKey = this.input
    },
    change: function (e) {
      this.resultShow = false
      if (e.target.value) {
        console.log(e.target.value)
        this.tempShow = true
        this.chooseShow = false
        this.items = []
        this.temps = []
        this.searchData()
      } else {
        this.tempShow = false
      }
    },
    clear: function () {
      this.input = ''
      this.tempShow = false
    },
    // 进入详情
    findDetail: function (item) {
      this.$router.push({path: '/behavior/list/schooldetail/', query: {org_id: item.id}})
      this.$router.go(1)
      // window.$.stationArr.push(document.body.scrollTop)
      // 保存高度
      this.$store.state.behavior.heightArr.push(document.body.scrollTop)
      console.log(this.$store.state.behavior.heightArr, '高度')
      // 保存数据
      this.$store.state.behavior.behaviorTemp = this.items
      this.$store.state.behavior.behaviorKey = this.input
      // 保存页数
      this.$store.state.behavior.page = this.page
      this.$store.state.behavior.pageSize = this.pageSize
      this.$store.state.behavior.count = this.count
      this.$store.state.behavior.school = item.name
      console.log(this.$store.state.record.page, 'page多少')
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
