<template>
  <div class="wrap">
    <section class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <router-link :to="{name: 'recordsearch', params: {recordSearch: false}}">
          <input id='input' type="text" placeholder="搜索用户" ref='input1' @input="change($event)">
        </router-link>
      </section>
    </section>
    <div id="pull-header" class="white"><section>刷新中...</section></div>
    <div class='content' @refresh="refresh" @append="append">
      <div id='noContent' v-if='text'>
        <img src='../../assets/logo_no.png'>
        <p>暂无内容</p>
      </div>
      <section class='shell' id='single' v-for='item in items' v-on:click='findDetail(item)'>
        <img v-show="+item.is_warning" src='../../assets/warnSign.png' >
        <div class='person'>
          <span>{{item.realname}}</span>
          <span>{{item.classname}}</span>
          <span>{{item.created_time}}</span>
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
  .wrap{
    & .search{
      width: 100%;
      height: 10rem;
      text-align: center;
      padding: 5% 2% 4% 2%;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
    & .content{
      width:100%;
      height:100%;
      position:relative;
      margin-top:0.5rem;
      & #noContent{
        width: 40%;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,200%);
        & p{
          font-size:2rem;
          color:#cdcdd6;
        }
        & img{
          width:7rem;
        }
      }
      & .shell{
        & .person {
          height:3rem;
          & span{
            line-height:3rem;
          }
          & span:nth-child(1){
            float: left;
            width: 24%;
            height:3rem;
            font-size: 1.8rem;
            color: #6c7079;
            margin: 0 0.6rem;
            overflow:hidden;
          }
          & span:nth-child(2){
            float: left;
            width:22%;
            color: #bdc0c7;
            font-size: 1.6rem;
            text-align:center;
            height: 3rem;
            text-overflow: ellipsis;
            overflow: hidden;
          } 
          & span:nth-child(3){
            float: right;
            width: 39%;
            color: #bdc0c7;
            font-size: 1.6rem;
            text-align: right;
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
      & #single img{
        width:2rem;
        float:left;
        margin-top:0.6rem;
      }
    }
    & #pull-header p{
      font-size:1.6rem;
      color:#fff;
    }
    & #pull-footer p{
      font-size:1.6rem;
      color:#3dbfff;
    }
  }
</style>
<script>
import functions from '../../functions'
export default {
  name: 'record',
  data () {
    return {
      // 渲染的数据
      items: [],
      // 正在加载
      loading: true,
      // 没有数据
      text: false,
      // 保存方法return
      touchRefresh: null,
      // 当前请求页数
      page: 1,
      // 数据总数量
      count: null,
      // 一页数据数量
      pageSize: null
      // 数组储存
      // storage: [],
      // recordTemp: []
    }
  },
  // 数据处理结束
  created () {
    // 暴露返回
    window.back = this.prev
    // 暴露点击
    window.clickButton = this.clickButton
    // if (window.$.stationArr.length === 0) {
  },
  mounted () {
    this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '记录' })
      this.$invoke('showButton', { text: '@add' })
    } catch (e) {
    }
    if (this.$store.state.record.heightArr.length === 0) {
      this.page = 1
      this.renderData()
    } else {
      if (this.$store.state.record.recordTemp.length === 0) {
        this.text = true
      } else {
        this.items = this.$store.state.record.recordTemp
        this.page = +this.$store.state.record.page
        this.count = this.$store.state.record.count
        this.pageSize = this.$store.state.record.pageSize
      }
      this.loading = false
      this.$nextTick(function () {
        document.body.scrollTop = this.$store.state.record.heightArr.pop()
      })
    }
  },
  methods: {
    renderData: function (append = false) {
      // var token = functions.getParam('token')
      // url = url + token + '&page=' + page
      // if (!this.$store.state.record.page) {
        // this.page = +this.$store.state.record.page
      // }
      let self = this
       // 渲染数据
      this.$http.jsonp(functions.getURL('record'), {params: {access_token: functions.getParam('token'), page: this.page}}).then(
      function (obj) {
        console.log(obj, '收到的数据')
        obj = obj.data
        try {
          if (!append) {
            self.items = []
          }
          this.count = obj.data.count
          this.pageSize = obj.data.page_size
          for (var i = 0; i < obj.data.list.length; i++) {
            let record = obj.data.list[i]
            self.items.push(record)
          }
          if (self.items.length === 0) {
            self.loading = false
            self.text = true
          } else {
            self.loading = false
            self.text = false
          }
        } catch (e) {

        }
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
      // window.$.jsonp(url, function (obj) {
      //   console.log(obj.data.list.length)
      //   try {
      //     if (!append) {
      //       self.items = []
      //       storage = []
      //     }
      //     count = obj.data.count
      //     pageSize = obj.data.page_size
      //     for (var i = 0; i < obj.data.list.length; i++) {
      //       let record = obj.data.list[i]
      //       // self.items.push(record)
      //       storage.push(record)
      //     }
      //     window.localStorage.setItem('recordTemp', JSON.stringify(storage))   // 将storage转变为字符串存储
      //     recordTemp = JSON.parse(window.localStorage.getItem('recordTemp'))
      //     self.items = recordTemp
      //     if (self.items.length === 0) {
      //       self.loadingShow = false
      //       self.textShow = true
      //     } else {
      //       self.loadingShow = false
      //       self.textShow = false
      //     }
      //   } catch (e) {

      //   }
      //   if (touchRefresh) {
      //     touchRefresh.recover()
      //   }
      // }, function () {
      //   if (touchRefresh) {
      //     touchRefresh.recover()
      //   }
      // })
    },
    // 刷新菜单
    refresh: function () {
      this.page = 1
      this.renderData()
    },
    // 下拉菜单
    append: function () {
      console.log(Math.ceil(this.count / this.pageSize))
      if (this.page < Math.ceil(this.count / this.pageSize)) {
        this.page++
        console.log(this.page)
        this.renderData(true)
      } else if (this.page === Math.ceil(this.count / this.pageSize)) {
        this.$invoke('showMessage', {message: '没有更多数据'})
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }
    },
    // 进入详情
    findDetail: function (item) {
      // 学生item
      var studentTemp = []
      studentTemp.push(item)
      this.$router.push({path: 'record/detail/', query: {items: studentTemp}})
      this.$router.go(1)
      // window.$.stationArr.push(document.body.scrollTop)
      // 保存高度
      this.$store.state.record.heightArr.push(document.body.scrollTop)
      // 保存数据
      this.$store.state.record.recordTemp = this.items
      // 保存页数
      this.$store.state.record.page = this.page.toString()
      this.$store.state.record.pageSize = this.pageSize
      this.$store.state.record.count = this.count
      console.log(this.$store.state.record.page, 'page多少')
    },
    // 返回按钮
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
      try {
        this.$invoke('toggleNavigation', { isShow: true })
        this.$invoke('setTitle', { title: '首页' })
      } catch (e) {
      }
    },
    // 添加按钮
    clickButton: function (type) {
      // window.localStorage.removeItem('recordParams')
      // this.$store.state.record.recordParams = []
      this.$router.push('/record/add/')
      this.$router.go(1)
    }
  }
}

</script>
