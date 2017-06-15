<template>
  <div class="wrap">
    <div class='top'></div>
    <div id='noContent' v-if='logoShow'>
      <img src='../../assets/logo_no.png'>
      <p>暂无内容</p>
    </div>
    <div class='content' v-if='isShow'>
      <section class='shell item'>
        <div class="title_name">{{title}}</div>
        <div class='time clearfix'>
          <div class="title_time">{{use_time}}</div>
          <div class="item_line"><span>{{created_date}}</span><span>{{created_time}}</span><span>{{done_week}}</span>
          </div>
        </div>
      </section>
      <div class='detail'>
        <section class='shell' v-if="isShow">
          <div class="msg_syn clearfix" v-on:click="changeList('willShow')">
            <span class='point'></span>
            <p class="report_name">量表简介</p>
            <img class='rowImg' src='../../assets/row.png' :style="willShow?'transform:rotate(90deg)':''">
          </div>
          <div class="msg_content" v-show="willShow">
            <div class="msg_metal">{{syn}}</div>
          </div>
        </section>
        <section class='shell' v-if="isShow">
          <div class="msg_explain clearfix" v-on:click="changeList('conShown')">
            <span class='point'></span>
            <p class="report_name">测试说明</p>
            <img class='rowImg' src='../../assets/row.png' :style="conShown?'transform:rotate(90deg)':''">
          </div>
          <div class="msg_content" v-show="conShown">
            <div class="msg_metal">{{explain}}</div>
          </div>
        </section>
        <section class='shell' v-if="isShow">
          <div class="msg_analysis clearfix" v-on:click="changeList('anShown')">
            <span class='point'></span>
            <p class="report_name">因子分析</p>
            <img class='rowImg' src='../../assets/row.png' :style="anShown?'transform:rotate(90deg)':''">
          </div>
          <div class="msg_content" v-show="anShown">
            <div class="msg_metal">{{analysis}}</div>
          </div>
        </section>
        <section class='shell' v-if="isShow">
          <div class="msg_station clearfix" v-on:click="changeList('msgShow')">
            <span class='point'></span>
            <p class="report_name">心灵加油站</p>
            <img class='rowImg' src='../../assets/row.png' :style="msgShow?'transform:rotate(90deg)':''">
          </div>
          <div class="msg_content" v-show="msgShow">
            <div class="msg_metal">{{station}}</div>
          </div>
        </section>
      </div>
    </div>
    <div id='bottom'></div>

  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    & .top{
      width:100%;
      height:5rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
  }
  & .content{
    margin-top:-3rem;
    & .item{
      padding: 0.6rem 0;
      background-color: #ffffff;
        & .title_name{
          font-size:1.8rem;
          color:#6c7079;
          padding-left:2rem;
          height: 3.5rem;
          line-height: 4rem;
        }
        & .time{
          width: 100%;
          padding: 0.2rem 1rem 0 1rem;
          color: #bdc0c7;
          font-size: 1.6rem;
          margin: 0 auto;
          height: 3rem;
          line-height: 1rem;
          & .title_time{
          float: left;
          width: 38%;
          padding-left:1rem;
          }
          & .item_line{
            float:left;
            & span{
              margin-right:0.8rem;
            }
          }
        }
      }
      & .detail{
        & .msg_syn, & .msg_explain, & .msg_analysis, & .msg_station{
          color: #686868;
          text-align: left;
          padding-top: 0.2rem;
          height: 4rem;
          line-height: 4rem;
          background-color: #ffffff;
          & span{
            display:inline-block;
            width:1.2rem;
            height:1.2rem;
            background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
            box-shadow: 0 0 0.5rem #56dcf9;
            border-radius:0.5rem;
            margin-right:1rem;
            float:left;
            margin-top:1.4rem;
          }
          & p{
            float: left;
            font-size: 1.8rem;
            height: 4rem;
            line-height: 4rem;
            text-align: center;
            color: #a5a6bb;
            margin-left: 1rem;
          }
          & img{
            float: right;
            height: 1.4rem;
            margin-top: 1.3rem;
          }
        }
        & .msg_content{
          font-size: 1.1rem;
          margin-top: 0;
          margin-bottom: 0;
          color: #bdc0c7;
          background-color: #f5f7f8;
          & div{
            height: 100%;
            width:100%;
            margin-top: 0.2rem;
            margin-bottom: 1rem;
            color: #a5a6bb;
            background-color: #ffffff;
            overflow-y:auto;
            font-size:1.8rem;
            line-height:2.5rem;
          }
        }
      }
    }
    & #bottom{
      width:100%;
      height:5rem;
    }

  }




</style>
<script>
import functions from '../../functions'
// var REPORTURL = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?access_token='
export default {
  name: 'report',
  data () {
    return {
      isShow: false,
      willShow: false,
      conShown: false,
      anShown: false,
      msgShow: false,
      logoShow: false,
      title: '',
      use_time: '',
      created_date: '',
      created_time: '',
      done_week: '',
      syn: '',
      explain: '',
      station: '',
      analysis: ''
    }
  },
  created () {
    console.log(window.innerHeight)
    document.documentElement.style.height = window.innerHeight + 'px' // 解决ios手机底部被遮挡导致无法点击的问题
    this.renderData()
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '查看报告' })
    } catch (e) {

    }
  },
  methods: {
    renderData: function () {
      // var url = 'https://cloudappapi.test.xlhb.com/v1/activity/view.api?access_token='
      var self = this
      // var token = functions.getParam('token')
      console.log(self.$route.params)
      // url = url + token + '&user_id=' + self.$route.params.userscale_id + '&act_id=' + self.$route.params.actscale_id + '&scale_id=' + self.$route.params.scale_id
      this.$http.jsonp(functions.getURL('activity/view'), functions.sendParam({
        user_id: self.$route.params.userscale_id,
        act_id: self.$route.params.actscale_id,
        scale_id: self.$route.params.scale_id
      })).then(function (obj) {
        console.log(obj, '收到的数据数据更改')
        obj = obj.data
        if (obj.msg === '无此报告') {
          self.isShow = false
          self.logoShow = true
        } else {
          self.logoShow = false
          self.isShow = true
          var view = obj.data
          try {
            var scale = view.scale
            self.title = scale.title
            self.use_time = '用时:' + view.use_time
            self.created_date = functions.getWeekDay(view.done_time * 1000).substr(0, 10)
            self.created_time = functions.getWeekDay(view.done_time * 1000).substr(11, 8)
            self.done_week = view.done_week
            if (scale.intro && scale.intro.length > 0) {
              self.syn = scale.intro
            } else {
              self.syn = '无'
            }
            if (scale.read && scale.read.length > 0) {
              self.explain = scale.read
            } else {
              self.explain = '无'
            }
            if (view.grow_content && view.grow_content.length > 0) {
              self.station = view.grow_content
            } else {
              self.station = '无'
            }
            if (scale.baogao_ter && scale.baogao_ter.length > 0) {
              // self.analysis = scale.baogao_ter + view.report_explans[1].content
              self.analysis = scale.baogao_ter + view.report_explans[0].content
            } else {
              self.analysis = '无'
            }
          } catch (e) {
          }
        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
      // window.$.jsonp(url, function (obj) {
      //   if (obj.msg === '无此报告') {
      //     self.isShow = false
      //     self.logoShow = true
      //   } else {
      //     self.logoShow = false
      //     self.isShow = true
      //     var view = obj.data
      //     try {
      //       var scale = view.scale
      //       self.title = scale.title
      //       self.use_time = '用时:' + view.use_time
      //       self.created_date = functions.getWeekDay(view.done_time * 1000).substr(0, 10)
      //       self.created_time = functions.getWeekDay(view.done_time * 1000).substr(11, 8)
      //       self.done_week = view.done_week
      //       if (scale.intro && scale.intro.length > 0) {
      //         self.syn = scale.intro
      //       } else {
      //         self.syn = '无'
      //       }
      //       if (scale.read && scale.read.length > 0) {
      //         self.explain = scale.read
      //       } else {
      //         self.explain = '无'
      //       }
      //       if (view.grow_content && view.grow_content.length > 0) {
      //         self.station = view.grow_content
      //       } else {
      //         self.station = '无'
      //       }
      //       if (scale.baogao_ter === null) {
      //         self.analysis = '无'
      //       } else {
      //         self.analysis = scale.baogao_ter + view.report_explans[1].content
      //       }
      //     } catch (e) {
      //     }
      //   }
      // })
    },
    changeList: function (showType) {
      if (this[showType] === true) {
        this[showType] = false
      } else {
        this[showType] = true
      }
    },
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
    }
  }
}

</script>
