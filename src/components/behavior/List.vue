<template>
  <div class="wrap_list">
    <!--search-->
    <section class="search">
      <section>
        <img id="search_img" src="../../assets/search.png" alt="">
        <router-link :to="{name: 'searchschool'}">
          <input id='input' type="search" placeholder="学校名称" ref='input1' @input="change($event)"
                 onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5]/g, '')" autocomplete="off" v-model='input'>
       </router-link>
        <img id="cancel_img" src="../../assets/cancel.png" alt="" v-show='input.length > 0' v-on:click='clear($event)'>
      </section>
    </section>
    <!--choose选择框-->
    <div class='choose'>
        <section class='shell noArea' v-on:click='chooseDate' v-if='isArea'> <!--区-->
          <!--时间-->
          <p>{{time}}</p>
          <img src="../../assets/row.png" alt="">
        </section>
        <!-- 搜索框 -->
        <section class='shell' v-on:click='chooseDate' v-if='!isArea'> <!--市-->
          <!--时间-->
          <p>{{time}}</p>
          <img src="../../assets/row.png" alt="">
        </section>
        <!-- 搜索框 -->
        <section class='shell' v-on:click='chooseArea' v-if='!isArea'> <!--市-->
          <!--地区名字-->
          <p>{{area}}</p>
          <img src="../../assets/row.png" alt="">
        </section>
        <section class='dateLayer' v-if='dateShow'>
          <div class='mask'></div>
          <div class='date_body'>
            <section class='choice'>
              <span v-on:click='cancel'>取消</span>
              <span v-on:click='confirm'>确定</span>
            </section>
            <section class='year'>
              <!--<p>{{year}}</p>-->
              <mt-picker :slots="slots_year"></mt-picker>
            </section>
            <section class='month'>
              <mt-picker :slots="slots_month" @change="onValuesChange"></mt-picker>
            </section>
          </div>
        </section>
        <section class='areaLayer' v-if='areaShow'>
          <div class='mark'></div>
          <div class='area_body'>
            <section class='choice'>
              <span v-on:click='cancel'>取消</span>
              <span v-on:click='confirm'>确定</span>
            </section>
            <section class='area'>
              <mt-picker :slots="slots_area" @change='onAreaChange'></mt-picker>
            </section>
          </div>
        </section>
      </div>
      <div id="pull-header"><section>刷新中...</section></div>

    <!--内容-->
    <div class='content' @refresh="refresh" @append="append">
      <div id='noContent' v-if='text'>
        <img src='../../assets/logo_no.png'>
        <p>暂无内容</p>
      </div>
      <section class='shell' id='single' v-for='item in items'>
        <!--跳转页面 学校详情-->
          <div class='school' v-on:click='findDetail(item)'>
            <span>{{item.name}}</span>
            <span>{{item.warning_count}}</span>
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
<style lang='postcss'>
  .wrap_list{
    & .search{
      width: 100%;
      height: 10rem;
      text-align: center;
      padding: 5% 2% 4% 2%;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
     & .choose{
          width:100%;
          height:6rem;
          line-height:3rem;
          font-size:1.6rem;
          color:#3dbfff;
          margin-bottom:0.2rem;
          overflow:hidden;
          margin-top:-2.5rem;
          & .picker-item{
             color: #d0d4dc !important;
             /*height: 4rem !important;
             line-height:4rem !important;*/
           }
           & .picker-selected{
             color:#a5a6bb !important;
             border-top: none !important;
             /*height: 4rem !important;
             line-height:4rem !important;*/
           } 
           & .picker-center-highlight{
              /*height:4rem;*/
           }
           & .picker-center-highlight::before{
             /*background-color: #fff !important;*/
           }
          & section:nth-child(1) {
            margin:0 2% 0 4%;
          }
          & section:nth-child(2) {
              margin:0;
          }
          & section{
            width:45%;
            float:left;
            & p{
              float:left;
            }
            & img{
                height:1rem;
                float:right;
                margin-top:1rem;
            }
          }
          & .noArea{
            width: 92% !important;
            float:left !important;
            & p{
              float:left;
            }
            & img{
                height:1rem;
                float:right;
                margin-top:1rem;
            }
          }
          & .dateLayer{
            z-index: 1;
            width: 100%;
            height: 100%;
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: block;
            & .mask {
              width:100%;
              height:60%;
              background: rgba(0, 0, 0, 0.6);
            }
            & .date_body{
              width:100%;
              height:40%;
              background-color: #fff;
              position:relative;
              & .choice{
                width:100%;
                height:4rem;
                font-size:1.8rem;
                line-height:4rem;
                margin:0;
                border-bottom:1px solid #e6e6ee;
                padding: 0 2rem;
                & span:nth-child(1){
                  float:left;
                }
                & span:nth-child(2){
                  float:right;
                }
              }
              & .year{
                width:35%;
                text-align: center;
                color:#000;
                font-size:1.8rem;
                position:absolute;
                top:5rem;
                left:10%;
                & p{
                  width:80%;
                  height:36px;
                  line-height:36px;
                  border-bottom:1px solid #e6e6ee;
                  border-top:1px solid #e6e6ee;
                }
              }
              & .month{
                width:35%;
                text-align: center;
                color:#a5a6bb;
                font-size:1.8rem;
                position:absolute;
                top:5rem;
                right:10%;
              }
            }
          }
          & .areaLayer{
            z-index: 1;
            width: 100%;
            height: 100%;
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: block;
            & .mark {
              width:100%;
              height:60%;
              background: rgba(0, 0, 0, 0.6);
            }
            & .area_body{
              width:100%;
              height:40%;
              background-color: #fff;
              & .choice{
                width:100%;
                height:4rem;
                font-size:1.8rem;
                line-height:4rem;
                margin:0;
                border-bottom:1px solid #e6e6ee;
                padding: 0 2rem;
                & span:nth-child(1){
                  float:left;
                }
                & span:nth-child(2){
                  float:right;
                }
              }
              & .area{
                width:80%;
                height:17rem;
                text-align:center;
                padding-top:1rem;
                margin-left:10%;
              }
            }
          }
      }
    & .content{
      width:100%;
      height:100%;
      position:relative;
      margin-top:0rem;  
    }
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
    & #pull-header{
      margin-top:0;
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
      touchRefresh: null,
      // 当前请求页数
      page: 1,
      // 数据总数量
      count: null,
      // 一页数据数量
      pageSize: null,
      areaShow: false,
      dateShow: false,
      input: '',
      time: '',  // 选择的时间
      area: '全部区域',   // 选择的地区名字 默认全部
      year: '2017年',
      slots_year: [{values: ['2017年']}],
      slots_month: [{values: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}],
      // 显示地区的数组
      slots_area: [],
      area_code: '',
      isArea: '', // 判断是否是区
      countArea: '' // 选择区域的区域
    }
  },
  // 数据处理结束
  created () {
    // 暴露返回
    window.back = this.prev
    // 暴露点击
    window.clickButton = this.clickButton
    // if (window.$.stationArr.length === 0) {
    // 设置time
    this.time = new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'
    console.log(this.time)
    this.getUserInfo()
    this.getArea()
    this.$store.state.behavior.areaCode = ''
    this.$store.state.behavior.year = ''
    this.$store.state.behavior.month = ''
  },
  mounted () {
    this.touchRefresh = window.touchRefresh(document.querySelector('.content'), {header: document.querySelector('#pull-header'), footer: document.querySelector('#pull-footer')})
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '行为预警' })
      // this.$invoke('showButton', { text: '@add' })
    } catch (e) {
    }
    // 返回时候 高度数组长度为0就直接渲染（第一次进来），不是0看是否有数据
    if (this.$store.state.behavior.heightArr.length === 0) {
      this.page = 1
      this.renderData(1)
    } else {
      if (this.$store.state.behavior.behaviorTemp.length === 0) {
        this.text = true
      } else {
        this.items = this.$store.state.behavior.behaviorTemp
        this.page = +this.$store.state.behavior.page
        this.count = this.$store.state.behavior.count
        this.pageSize = this.$store.state.behavior.pageSize
        this.area = this.$store.state.behavior.listArea
        this.time = new Date().getFullYear() + '年' + this.$store.state.behavior.listMonth + '月'
      }
      this.loading = false
      this.$nextTick(function () {
        document.body.scrollTop = this.$store.state.behavior.heightArr.pop()
      })
    }
  },
  updated () {
    if (this.areaShow || this.dateShow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  },
  methods: {
    renderData: function (areaCode, append = false) {
      console.log(areaCode, '区域编码')
      let self = this
      console.log(this.time, 'this.time')
      var monthStr = this.time.split('年')[1]
      monthStr = monthStr.substring(0, monthStr.length - 1)
      console.log(monthStr, '日期')
      var sendData = {
        access_token: functions.getParam('token'),
        page: this.page,
        year: this.time.split('年')[0],
        month: monthStr,
        select_area_code: areaCode
        // select_school_name: selectSchoolName
      }
      console.info(sendData, 'sendData')
       // 渲染数据
      // this.$http.jsonp(functions.getURL('edu-bwarning/list'), {params: {access_token: functions.getParam('token'), page: this.page, year: 2017, month: 4}}).then(
      this.$http.jsonp(functions.getURL('edu-bwarning/list'), {params: sendData}).then(
      function (obj) {
        console.log(obj, '列表数据')
        console.log(obj.data)
        obj = obj.data
        try {
          if (!append) {
            self.items = []
          }
          this.count = obj.data.count
          this.pageSize = obj.data.page_size
          for (var i = 0; i < obj.data.length; i++) {
            let behavior = obj.data[i]
            // 设置地区名字
            console.log(this.isArea, '测试')
            if (this.isArea) { // 表示是区
              // this.area = obj.data[i].area_name
              // this.area_code = obj.data[i].area // 区的编码
              this.area_code = this.$store.state.behavior.listAreaCode  // 区的编码
              console.log(this.area, '地区1')
            }
            self.items.push(behavior)
          }
          if (self.items.length === 0) {
            self.loading = false  // 读取结束
            self.text = true // 无内容
          } else {
            self.loading = false  // 读取结束
            self.text = false  // 有内容
          }
        } catch (e) {

        }
        if (this.touchRefresh) {
          this.touchRefresh.recover()
        }
      }, function (obj) {
        console.log('网络请求失败')
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    getArea: function () {
      this.$http.jsonp(functions.getURL('edu-bwarning/city-by-province'), {params: {access_token: functions.getParam('token')}}).then(
      function (obj) {
        console.log(obj)
        this.slots_area = []
        obj = obj.data
        // 地区编码数组
        this.countArea = obj.data.countArea
        var objArea = {values: ['全部区域', '直属学校']}
        for (var k in obj.data.countArea) {
          objArea.values.push(obj.data.countArea[k])
        }
        this.slots_area.push(objArea)
        // 打印数据
        console.log(this.slots_area)
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    // 刷新菜单
    refresh: function () {
      // this.page = 1
      // if (this.input.length === 0) {
      //   if (this.area === '全部区域') {
      //     this.renderData(1)
      //   } else if (this.area === '直属学校') {
      //     this.renderData(2)
      //   } else {
      //     this.renderData(this.area_code)
      //   }
      // } else {
      //   this.search(event)
      // }
      if (this.touchRefresh) {
        this.touchRefresh.recover()
      }
    },
    // 下拉菜单
    append: function () {
      // console.log(Math.ceil(this.count / this.pageSize))
      // if (this.page < Math.ceil(this.count / this.pageSize)) {
        // this.page++
        // console.log(this.page)
        // if (this.input.length === 0) {
          // if (this.area === '全部区域') {
            // this.renderData(1, true)
          // } else if (this.area === '直属学校') {
            // this.renderData(2, true)
          // } else {
            // this.renderData(this.area_code, true)
          // }
        // } else {
          // this.search(event, true)
        // }
      // } else if (this.page === Math.ceil(this.count / this.pageSize)) {
      this.$invoke('showMessage', {message: '没有更多数据'})
      if (this.touchRefresh) {
        this.touchRefresh.recover()
      }
      // }
    },
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
    },
    getUserInfo: function () {
      this.$http.jsonp('https://apicloud.xlhb.com/v1/user/user-info.api', {params: {access_token: functions.getParam('token')}}).then(
        function (obj) {
          console.log(obj, 'getUserInfo')
          obj = obj.data
          // console.log(obj.data.data.role)
          // this.$store.state.role = obj.data.data.role
          console.log('判断市，区教育局')
          if (obj.data.province_name !== '' && obj.data.city_name !== '' && obj.data.area_name !== '') { // 省市都不为空为市  省市区都不为空为区
            this.isArea = true  // 表示是区
            console.log('这个是区教育局')
          }
        }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    chooseArea: function () {
      if (!this.isArea) {
        this.areaShow = true
      }
    },
    // 日期选择框显示
    chooseDate: function () {
      this.dateShow = true
    },
    // 隐藏选择框
    cancel: function () { // 取消
      this.areaShow = false
      this.dateShow = false
    },
    confirm: function () { // 确定
      this.page = 1
      if (this.areaShow) {
        this.areaShow = false
        console.log('地区选择')
        var area = document.getElementsByClassName('picker-selected')[0].innerText
        console.log(area, '535')
        console.log(this.countArea, '城市')
        for (var m in this.countArea) {
          if (this.countArea[m] === area) {
            this.area_code = m
            console.log(this.area_code, '地区编码')
          }
        }
        console.log(this.area, '全部区域')
        if (area === '全部区域') {
          this.area_code = 1
        } else if (area === '直属学校') {
          this.area_code = 2
        }
        this.area = area
        this.$store.state.behavior.listAreaCode = this.area_code
        console.log(this.area_code, '确定')
      } else if (this.dateShow) {
        this.dateShow = false
        console.log('日期选择')
        var year = document.getElementsByClassName('picker-selected')[0].innerText
        var month = document.getElementsByClassName('picker-selected')[1].innerText
        console.log(this.$store.state.behavior.listAreaCode, 'bain吗')
        if (this.isArea) {
          this.area_code = 1
        } else {
          console.log(this.area_code, '吗')
          this.area_code = this.$store.state.behavior.listAreaCode
          console.log(this.area_code)
        }
        this.time = year + month
      }
      console.log('神')
      if (this.input.length === 0) {
        console.log(this.$store.state.behavior.listAreaCode, '是打发十分')
        // this.area_code = this.$store.state.behavior.listAreaCode
        this.renderData(this.area_code)
      } else {
        this.search(event)
      }
    },
    onValuesChange: function (picker, values) { // 设置默认显示
      values[0] = this.time.split('年')[1].split('月')[0] + '月'
    },
    onAreaChange: function (picker, values) {
      values[0] = this.area
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
      // 保存页数
      this.$store.state.behavior.page = this.page.toString()
      this.$store.state.behavior.pageSize = this.pageSize
      this.$store.state.behavior.count = this.count
      this.$store.state.behavior.school = item.name
      var monthStr = this.time.split('年')[1]
      monthStr = monthStr.substring(0, monthStr.length - 1)
      this.$store.state.behavior.listMonth = monthStr
      this.$store.state.behavior.listArea = this.area
      console.log(this.area_code, '测试bain吗')
      this.$store.state.behavior.listAreaCode = this.area_code
      console.log(this.$store.state.record.page, 'page多少')
    }
  }
}
</script>
