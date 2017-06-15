<template>
  <div class="wrap">
    <section class="search">
      <section class='shell shell1'>
        <img v-show='preBtn' src="../../assets/row.png" alt="" style="transform:rotate(180deg)" v-on:click='getDay(date, "pre")'>
        <!--<span id='touch'>{{date}}</span>-->
        <span>{{date}}</span>
        <img v-show='nextBtn' src="../../assets/row.png" alt="" v-on:click='getDay(date, "next")'>
      </section>
    </section>
    <div class='content'>
      <div id='noContent' v-if='text'>
        <img src='../../assets/logo_no.png'>
        <p>暂无内容</p>
      </div>
      <section class='shell' id='single' v-for='item in items' v-on:click='findDetail(item)'>
        <img v-if="item.is_warning==='1'" src='../../assets/warnSign.png' >
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
  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    & .search{
      width: 100%;
      height: 12rem;
      text-align: center;
      padding: 5% 2% 4% 2%;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
      & section{
        height:6rem;
        line-height:4rem;
        position: relative;
        & img:nth-child(1){
          position:absolute;
          top:1rem;
          left:1rem;
          height:1.4rem;
          // float:left;
          margin-top:1.3rem;
        }
        & img:nth-child(3){
          position:absolute;
          top:1rem;
          right:1rem;
          height:1.4rem;
          // float:right;
          margin-top:1.3rem;
        }
        & span{
          // line-height: 4rem;
          // position: absolute;
          // top:1rem;
          // left:9rem;
          vertical-align: middle;
          font-size:2rem;
          color:#3dbfff;
        }
      }
    }
    & .content{
      width:100%;
      height:100%;
      position:relative;
      margin-top:-2.5rem;
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
            color: #d2d7e1;
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
        margin-top:0.5rem;
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
  name: 'behavior',
  data () {
    return {
      // 渲染的数据
      items: [],
      // 正在加载
      loading: true,
      // 没有数据
      text: false,
      // 保存方法return
      // date: '2017年4月23日'
      date: this.$route.params.date,
      record_data: '',
      // 传输的时间数据
      data: '',
      sd: 0,
      key: true,
      preDate: null,
      nextDate: null,
      preBtn: false,
      nextBtn: false,
      title: ''
    }
  },
  // 数据处理结束
  created () {
    // 暴露返回
    window.back = this.prev
    // 暴露点击
    window.clickButton = this.clickButton
    console.log(this.$route.params.org_id, '测试')
  },
  mounted () {
    // this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
    console.log(this.$store.state.behavior.school, '学校')
    if (this.$store.state.behavior.school.length >= 8) {
      this.title = this.$store.state.behavior.school.substr(0, 8) + '...'
    } else {
      this.title = this.$store.state.behavior.school
    }
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: this.title })
    } catch (e) {
    }
    console.log(this.$store.state.behavior.dateHeightArr, '高度')
    if (this.$store.state.behavior.dateHeightArr.length === 0) {    // 返回
      // this.page = 1
      this.renderData(false)
    } else {
      this.preDate = this.$store.state.behavior.preDate  // 保存前面日期
      this.nextDate = this.$store.state.behavior.nextDate  // 保存后面日期
      this.$store.state.behavior.preDate = ''  // 恢复原值
      this.$store.state.behavior.nextDate = ''  // 恢复原值
      if (this.nextDate !== null) {
        this.nextBtn = true  // 箭头
      } else {
        this.nextBtn = false // 箭头
      }
      if (this.preDate !== null) { // 前面的日期
        this.preBtn = true   // 箭头
      } else {   // 前面没日期
        this.preBtn = false  // 箭头
      }
      if (this.$store.state.behavior.dateArr.length === 0) {
        this.text = true
      } else {
        this.items = this.$store.state.behavior.dateArr
        console.log(this.$store.state.behavior.date, '日期')
        this.date = this.$store.state.behavior.date
      }
      this.loading = false
      this.$nextTick(function () {
        document.body.scrollTop = this.$store.state.behavior.dateHeightArr.pop()
      })
    }
    // this.touch()
  },
  methods: {
    // 渲染数据
    renderData: function (type, touch, append = false) {  // 往前  第二次
      // this.data = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())  // 下次请求的数据
      console.log(type)
      console.log(this.data, '11111111111111111')
      var self = this
       // 渲染数据
      var token = functions.getParam('token')
      if (this.sd === 0) {  // 第一次执行用  然后锁了
        this.sd ++
        var year = this.date.split('年')[0]
        var month = this.date.split('年')[1].split('月')[0]
        // if (month < 10) {
          // month = '0' + month
        // }
        var day = this.date.split('年')[1].split('月')[1].split('日')[0]
        // if (day < 10) {
          // day = '0' + day
        // }
        var date = year + '-' + month + '-' + day
        // 把数据给假时间数据
        this.data = date
        console.log(this.data, '第一次打印data')
      }
      var sendData
      // var timer = setInterval(function () {
      if (type === 'pre') { // 判断是否滑动或点击
        sendData = {
          access_token: token,
          // page: this.page,
          org_id: self.$route.params.org_id,
          // select_time: self.data,   //  20170214
          select_date: self.preDate,
          keywords: ''
        }
        // this.date = this.preDate.substring(0, 4) + '年' + this.preDate.substring(5, 7) + '月' + this.preDate.substring(8, 10) + '日'
        console.log('切换日期')
      } else if (type === 'next') {
        sendData = {
          access_token: token,
          // page: this.page,
          org_id: self.$route.params.org_id,
          // select_time: self.data,   //  20170214
          select_date: self.nextDate,
          keywords: ''
        }
        console.log(self.nextDate, '往后的日期')
        // this.date = this.nextDate.substring(0, 4) + '年' + this.nextDate.substring(5, 7) + '月' + this.nextDate.substring(8, 10) + '日'
        console.log(this.date)
      } else {  // 第一次进入
        sendData = {
          access_token: token,
          // page: this.page,
          org_id: self.$route.params.org_id,
          // ids: self.$route.params.ids,
          select_date: self.$route.params.day,
          keywords: ''
        }
      }
      console.log(sendData.select_time, '参数')
      self.$http.jsonp(functions.getURL('edu-bwarning/behavior-detail'), {params: sendData}).then(
      function (obj) {
        if (type === 'pre') {
          this.date = this.preDate.substring(0, 4) + '年' + this.preDate.substring(5, 7) + '月' + this.preDate.substring(8, 10) + '日'
        }
        if (type === 'next') {
          this.date = this.nextDate.substring(0, 4) + '年' + this.nextDate.substring(5, 7) + '月' + this.nextDate.substring(8, 10) + '日'
        }
        // console.log(obj, '1111')
        console.log(obj, '接口获得的数据')
        obj = obj.data.data
        self.nextDate = obj.RecordNextDate    // 后面的日期赋值给本地
        if (self.nextDate !== null) {
          self.nextDate = self.nextDate.create_at.substring(0, 10)   // 后面那天 改格式
          self.nextBtn = true  // 箭头
        } else {
          self.nextBtn = false // 箭头
        }
        self.preDate = obj.RecordPreDate   // 前面的日期赋值给本地
        if (self.preDate !== null) { // 前面的日期
          self.preDate = self.preDate.create_at.substring(0, 10)    // 前面那天  改格式
          console.log(self.preDate, '前面的日期')
          // var preDateSplit = self.preDate.substring(0, 4) + self.preDate.substring(5, 7) + self.preDate.substring(8, 10)
          // console.log(preDateSplit, '拼接的日期')
          self.preBtn = true   // 箭头
          // if (preDateSplit < '20170405') {
          //   self.preBtn = false
          // } else {
          //   self.preBtn = true
          // }
        } else {   // 前面没日期
          self.preBtn = false  // 箭头
        }
        console.log(self.nextDate)
        try {
          // if (!append && self.data !== '2017-04-05') {  // 如果不是append那么变空  4月5号不清空   这个代码有问题 如果没数据就会清空
          //   self.items = []
          // }
          console.log(obj.record_data)
          self.record_data = obj.record_data
          if (obj.record_data.length === 0) {
            // 没数据执行代码
            // 保存这个日期
            // 如果到今天这个值还是没有数据的话 渲染上一次的那个数据
            // var now = new Date().getDate()
            // console.log(now, 'now')
            // var last = self.data.charAt(self.data.length - 1)
            // console.log(last, '最后一个字符')
            // var lastTwo = self.data.charAt(self.data.length - 2)
            // console.log(lastTwo, '最后2个字符')
            // var last = self.data.substring(self.data.length - 2)
            // console.log(last, '最后')
            // console.log(new Date(self.data).getTime(), '11111')
            // if (self.data) {
              // self.renderData(null, true)
              // return
            // }
            this.key = true
            // if (self.data === '2017-04-05') {  // 如果4月5号没有数据的话 那么就停止循环
              // return
            // }
            // self.getDay(self.data, type) // 循环请求代码
            // return
          } else {
            if (!append) {  // 这边再清空一次
              self.items = []
            }
            // this.$store.state.behavior.timer = self.data  // 保存当前的时间
            // console.log(this.$store.state.behavior.kengbi, '肯比')  // 2017-5-6
            // 将时间给到界面上去
            // ******************渲染日期************************
            // if (self.sd > 1) {
            //   console.log('进入判断')
            //   console.log(self.data, '到达下一个时间段')
            //   var a = self.data
            //   console.log(a, 'a的值')
            //   var year = self.data.substring(0, 4)
            //   console.log(year)
            //   var month = self.data.substring(5, 7)
            //   console.log(month)
            //   var date = self.data.substring(8, 10)
            //   console.log(date)
            //   self.date = year + '年' + month + '月' + date + '日'
            // }
            // clearInterval(timer)
            for (var i = 0; i < obj.record_data.length; i++) {
            // let behavior = {realname: obj.record_data[i].realname, classname: obj.record_data[i].classname, created_time: obj.record_data[i].created_time, is_warning: obj.record_data[i].is_warning}
              self.items.push(obj.record_data[i])
            }
            console.log(self.items)
            if (self.items.length === 0) {
              self.loading = false
              // self.text = true
            } else {
              self.loading = false
              // self.text = false
            }
            this.key = true
          }
        } catch (e) {

        }
        if (self.touchRefresh) {
          self.touchRefresh.recover()
        }
      }, function () {
        if (self.touchRefresh) {
          self.touchRefresh.recover()
        }
        window.$.invoke('showMessage', { message: '网络请求失败' })
        this.key = true
        console.log(this.key)
      })
      // }, 500)
    },
    // 进入详情
    findDetail: function (item) {
      // 学生item
      var studentTemp = []
      studentTemp.push(item)
      console.log(item, 'item')
      // var ids = this.$route.params.ids
      // console.log(ids, 'ids')
      // console.log(item.record_id, 'item的recordid')
      var recordId = item.record_id
      // var recordId = this.record_data[0].record_id
      this.$store.state.behavior.recordId = recordId
      // console.log(this.$store.state.behavior.recordId, '跨域recordId')
      // console.log(recordId, 'recordData')
      this.$router.push({path: '/behavior/list/schooldetail/datedetail/recorddetail', query: {items: studentTemp, record_id: recordId}})
      this.$router.go(1)
      // window.$.stationArr.push(document.body.scrollTop)
      // 保存高度
      this.$store.state.behavior.dateHeightArr.push(document.body.scrollTop)
      // 保存数据
      this.$store.state.behavior.dateArr = this.items
      this.$store.state.behavior.date = this.date
      this.$store.state.behavior.preDate = this.preDate   // 保存前面日期
      this.$store.state.behavior.nextDate = this.nextDate    // 保存后面日期
      console.log(this.$store.state.behavior.page, 'page多少')
    },
    // 返回按钮
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
    },
    getDay: function (d, type) { // 这个页面现在的时间数据   往前往后
    // 最小值，将这个值保存下来， 有2种情况 1.4月5号有数据   2.4月5号没数据
      if (this.key) {
        this.key = false
        this.sd++
        console.log(d, '传进去的data')
        // var date = d.replace(/[^0-9]/ig, '-').substr(0, d.length - 1) // 将2017年2月23日转换成2017-2-23格式
        var date = d.replace(/['年']/i, '-').replace(/['月']/i, '-').replace(/['日']/i, '') // 将2017年2月23日转换成2017-2-23格式
        // console.log(date, '改变形式')
        console.log(this.$store.state.behavior.timer, 'store')
        // if (type === 'pre' && date === '2017-04-05') {
          // console.log('往前 输入的是20170405 停掉')
          // return
          // this.$store.state.behavior.pre = date
          // console.log(this.$store.state.behavior.pre, 'pre的值')   // 如果是往前 保存下日期
        // }
        // if (date === this.$store.state.behavior.timer && type === 'next') {   // date是传进来的时间
          // console.log('next到头了 return')
          // this.renderData(type, true)
          // this.key = true
          // return
        // }
        console.log(type, '往前还是往后')
        d = new Date(date)
        if (type === 'pre') {
          d = +d - 1000 * 60 * 60 * 24   // 往前一天时间
        } else if (type === 'next') {
          d = +d + 1000 * 60 * 60 * 24   // 往后一天时间
        }
        console.log(d, 'd')
        console.log(new Date().getTime(), '现在的时间')    // 现在的时间
        // if (d > new Date().getTime()) {
          // this.data = this.$store.state.behavior.timer
          // this.renderData()
          // return
        // }
        // console.log('继续下去吗')
        d = new Date(d)
        this.data = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + '-' + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate())  // 下次请求的数据
        console.log(this.data, '更新后的data')
        this.renderData(type, true)
        // return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
        // var self = this
        // var timer = setInterval(function () {
        //   if (type === 'pre') {
        //     d = +d - 1000 * 60 * 60 * 24
        //   } else if (type === 'next') {
        //     d = +d + 1000 * 60 * 60 * 24
        //   }
        //   d = new Date(d)
          // self.date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
          // self.renderData(true) // rrue时滑动点击了
          // clearInterval(timer)
          // if (self.record_data.length === 0) {
          //   return
          // } else {
          //   self.date = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
          //   self.renderData(true)
          //   clearInterval(timer)
          // }
        // }, 1)
      }
    }
    // touch: function () {
    //   var startx  // 让startx在touch事件函数里是全局性变量。
    //   var endx
    //   var el = document.getElementById('touch')
    //   var self = this
    //   function cons () {   // 独立封装这个事件可以保证执行顺序，从而能够访问得到应该访问的数据。
    //     if (startx > endx) {  // 判断左右移动程序
    //       self.getDay(self.date, 'next')
    //     } else {
    //       self.getDay(self.date, 'pre')
    //     }
    //   }
    //   el.addEventListener('touchstart', function (e) {
    //     var touch = e.changedTouches
    //     startx = touch[0].clientX
    //     // starty = touch[0].clientY
    //   })
    //   el.addEventListener('touchend', function (e) {
    //     var touch = e.changedTouches
    //     endx = touch[0].clientX
    //     // endy = touch[0].clientY
    //     cons()  // startx endx 的数据收集应该放在touchend事件后执行，而不是放在touchstart事件里执行，这样才能访问到touchstart和touchend这2个事件产生的startx和endx数据。另外startx和endx在_touch事件函数里是全局性的，所以在此函数中都可以访问得到，所以只需要注意事件执行的先后顺序即可。
    //   })
    // }
  }
}

</script>
