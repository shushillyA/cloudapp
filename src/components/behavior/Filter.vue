<template>
  <div class="wrap123">
      <section class="search"> </section>
    <div class='content'>
      <div class='choose'>
        <section class='shell' v-on:click='chooseDate'>
          <p>{{time}}</p>
          <img src="../../assets/row.png" alt="">
        </section>
        <section class='shell' v-on:click='chooseArea' v-if='!isArea'>
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
              <mt-picker :slots="slots_area" @change="onAreaChange"></mt-picker>
            </section>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<style lang='postcss'>
  .wrap123{
    & .search{
      width: 100%;
      height: 3rem;
      text-align: center;
      padding: 5% 2% 4% 2%;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
    & .content{
      width:100%;
      height:100%;
      position:relative;
      margin-top:-3rem;
      & .choose{
          width:100%;
          line-height:3rem;
          font-size:1.6rem;
          color:#3dbfff;
          margin-bottom:0.2rem;
          overflow:hidden;
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
          & .shell{
            width:94%;
            margin:4%;
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
      
    }
  }
</style>
<script>
import functions from '../../functions'
export default {
  name: 'filter',
  data () {
    return {
      areaShow: false,
      dateShow: false,
      time: this.$route.query.date.substr(0, 7),
      // time: '2017年5月',
      area: '全部区域',
      year: '2017年',
      slots_year: [{values: ['2017年']}],
      slots_month: [{values: ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']}],
      slots_area: [],
      isArea: false,
      countArea: '',
      monthPicker: ''
    }
  },
  // 数据处理结束
  created () {
    this.$store.state.noWLAN.index = 'filter'   // 标识符
    // 暴露返回
    window.back = this.prev
    this.getUserInfo()
    this.area = this.$store.state.behavior.area1
    this.renderData()
    this.$store.state.behavior.areaCode = ''
    this.$store.state.behavior.year = ''
    this.$store.state.behavior.month = ''
    console.log(this.$route.params, '日期')
  },
  mounted () {
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '筛选' })
    } catch (e) {
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
    renderData: function () {
      // var month = new Date().getMonth() + 1
      // var monthObj = {values: []}
      // for (var w = 4; w <= month; w++) {
      //   monthObj.values.push(w + '月')
      // }
      // this.slots_month.push(monthObj)
      // console.log(this.slots_month)
      this.$http.jsonp(functions.getURL('edu-bwarning/city-by-province'), {params: {access_token: functions.getParam('token')}}).then(
      function (obj) {
        this.slots_area = []
        obj = obj.data
        // 地区编码数组
        this.countArea = obj.data.countArea
        var objArea = {values: ['全部', '直属学校']}
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
          }
        }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    chooseArea: function () {
      this.areaShow = true
    },
    chooseDate: function () {
      this.dateShow = true
    },
    cancel: function () { // 取消
      this.areaShow = false
      this.dateShow = false
    },
    confirm: function () { // 确定
      this.$store.state.behavior.flag = 1
      if (this.areaShow) {
        this.areaShow = false
        var area = document.getElementsByClassName('picker-selected')[0].innerText
        console.log(area, '区域')
        for (var m in this.countArea) {
          if (this.countArea[m] === area) {
            this.area_code = m
            console.log(this.area_code, '地区编码')
          }
        }
        if (area === '全部') {
          this.area_code = 1
        } else if (area === '直属学校') {
          this.area_code = -1
        }
        this.area = area
        this.$store.state.behavior.areaCode = this.area_code
        this.$store.state.behavior.area = this.area
      } else if (this.dateShow) {
        this.dateShow = false
        var year = document.getElementsByClassName('picker-selected')[0].innerText
        var month = document.getElementsByClassName('picker-selected')[1].innerText
        this.time = year + month
        this.$store.state.behavior.year = year
        this.$store.state.behavior.month = month
      }
      this.$store.state.behavior.filterFlag = false
    },
    onValuesChange: function (picker, values) {
      // values[0] = this.time.split('年')[1].split('月')[0] + '月'
      values[0] = this.$route.query.date.split('年')[1].split('月')[0] + '月'
    },
    onAreaChange: function (picker, values) {
      // values[0] = this.$route.query.area
      values[0] = this.area
    },
    // 返回按钮
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
      this.$store.state.behavior.prev = 1  // 返回判断
      this.$store.state.behavior.year = this.time.split('年')[0]
      this.$store.state.behavior.month = this.time.split('年')[1].split('月')[0]
    }
  }
}
</script>
