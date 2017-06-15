<template>
  <div class='wrap'>
    <div class="title"></div>
    <div v-if='resultShow' id='noContent'>
        <img src='../../assets/logo_no.png'>
        <p>暂无内容</p>
      </div>
    <div class='content'>
      <section class='shell detail' v-for='item in items'>
        <h2>{{item.class_name.fullName}}<span>{{item.sum_user}}人</span>
          <div><img src='../../assets/row_up.png'>{{item.life_event}}</div>
        </h2>
        <ul>
          <li><span>{{item.join_user}}</span><span>参加测评</span></li>
          <li><span>{{item.finish_user}}</span><span>已经完成</span></li>
          <li><span>{{item.underway_user}}</span><span>课程进行</span></li>
          <li><span>{{item.warning_person_num}}</span><span>预警人数</span></li>
          <li><span id='sum_warn'>{{item.warning_sum}}</span><span>总预警数</span></li>
        </ul>
      </section>
      <section class='shell week' v-if='weekShow'>
        <ul class='week_half1'>
          <template v-for='(weekName, index) in weekNames'>
            <li v-if="index % 2 === 0" :class="{last_week: index === lastWeek}">第{{weekName}}周</li>
          </template>
        </ul>
        <ul class='progress_line'>
          <li class='static_line' v-for='(weekName, index) in weekNames' :class="{passed_week: index < lastWeek, last_week: index === lastWeek}"><em></em></li>
          <span></span>
        </ul>
        <ul class='week_half2'>
          <template v-for='(weekName, index) in weekNames'>
            <li v-if="index % 2" :class="{last_week: index === lastWeek}">第{{weekName}}周</li>
          </template>
        </ul>
      </section>
      <section class='shell' v-for='student in students'>
        <router-link :to="{name: 'cognitionreport', params: {user_id: student.user_id, realname: student.realname, class_name: student.class_name, finish: student.finish, last_warning_level: student.last_warning_level, clothbag_id: student.clothbag_id, solution_id: student.solution_id, now_warning_level: student.now_warning_level}}">
          <div>
            <div class='person'>
              <img v-if="student.now_warning_level==='红色预警'" src='../../assets/warnSign.png' class='warnsign_img'>
              <img v-if="student.now_warning_level==='橙色预警'" src='../../assets/warnSign3.png' class='warnsign_img'>
              <img v-if="student.now_warning_level==='黄色预警'" src='../../assets/warnSign2.png' class='warnsign_img'>
              <img v-if="student.now_warning_level==='无预警'" src='../../assets/warnSign1.png' class='warnsign_img'>
              <p class='name'>{{student.realname}}</p>
              <p class='class'>{{student.class_name.fullName}}</p>
              <p class='progress_text'>进度{{student.finish}}</p>
              <img src='../../assets/row.png' class='row_img'>
            </div>
            <div class='relate'>
              <h2>末次预警<span>{{student.last_warning_level}}</span></h2>
              <h2>激活事件<span>{{student.solution_id}}</span></h2>
              <h2>获取锦囊<span>{{student.clothbag_id}}</span></h2>
            </div>
          </div>
        </router-link>
      </section> 
    </div>
    <div class='loading' v-if='loadingShow'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
  </div>
</template>
<style scoped>
  .wrap{
    & .title{
      width: 100%;
      height: 7rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#3095fc), to(#2cd2f1));
    }
    & .content{
      width: 100%;
      height: 100%;
      margin-top: -5rem;
      margin-bottom: 8rem;
      & .detail{
        border-radius: 1.8rem 1.8rem 0 0;
        margin-bottom: 0;
        background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff484), to(#ffac52));
        & h2{
          font-size: 1.8rem;
          color: #ffad53;
          margin-top: 0.8rem;
          height: 2rem;
          & span:nth-child(1) {
            font-size: 1.6rem;
            color: #ffad53;
            margin-left: 1.5rem;
          }
          & div{
            display: inline-block;
            float: right;
            width: 5rem;
            height: 2rem;
            text-align: center;
            line-height: 2rem;
            border-radius: 1rem;
            background-color: #ffad53;
            font-size: 1.4rem;
            color: #fff;
          }
          & img{
            width: 1.4rem;
          }
        }
         & li{
            float: left;
            text-align: center;
            line-height: 2rem;
            margin: 1.5rem 0;
            width: 20%;
            & span:nth-child(1) {
              font-size: 1.8rem;
              color: #fff;
              width: 100%;
              display: inline-block;
              border-right: 1px solid #fff;
            }
            & span:nth-child(2) {
              font-size: 1.4rem;
              color: #fff;
            }
          }
      
      }
      & .week{
        border-radius: 0 0 1.8rem 1.8rem;
        & ul{
          width: 100%;
          clear: both;
          & li{
            float: left;
          }
        }
        & .week_half1{
          padding-right: 3.6rem;
          & li{
            float: left;
            text-align: center;
            line-height: 2rem;
            margin: 1.5rem 0;
            font-size: 1.6rem;
            width: 24.5%;
            color: #c2c3d8;
          }
          & li.last_week{
            color: #31c7f7;
          }
        }
        & .week_half2{
          padding-left: 3rem;
          & li{
            float: left;
            text-align: center;
            line-height: 2rem;
            margin: 1.5rem 0;
            font-size: 1.6rem;
            width: 24.5%;
            color: #c2c3d8;
          }
           & li.last_week{
            color: #31c7f7;
          }
        }
        & .progress_line{
          height: 2px;
          & li, & span{
            float: left;
            height: 1px;
            width: 11%;
            background: #e1e2ed;
            position: relative;
          }
          & li.passed_week{
            background-color: #31c7f7;
            & em{
              border-color: #31c7f7;
            }
          }
          & li.last_week{
            background-color: #31c7f7;
            & em{
              background-color: #31c7f7;
              border-color: #31c7f7;
            }
          }
          & em{
            display: inline-block;
            position: absolute;
            content: "";
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid #e1e2ed;
            background-color: #fff;
            top: 0;
            right: 0;
            transform: translateY(-5px);
          }
        }
      }
      & .person{
        line-height: 4rem;
        overflow: hidden;
        position: relative;
        & .warnsign_img{
          float: left;
          width: 2.4rem;
          margin-top: 0.8rem;
        }
        & .row_img{
          width: 1rem;
          position: absolute;
          right: 1rem;
          top: 1.4rem;
        }
        & .name{
           float: left;
          width: 22%;
          height: 4rem;
          font-size: 2rem;
          color: #6c7079;
          margin: 0 0.6rem;
          overflow: hidden;
        }
        & .class{
          float: left;
          width: 28%;
          color: #bdc0c7;
          font-size: 1.8rem;
        }
        & .progress_text{
          float: right;
          width: 22%;
          color: #bdc0c7;
          font-size: 1.8rem;
          text-align: right;
          margin-right: 10%;
        }
      }
      & .relate{
        overflow: hidden;
        & h2{
          width: 33%;
          font-size: 1.8rem;
          color: #aaaab9;
          float: left;
          text-align: center;
          line-height: 3rem;
          & span{
            color: #3dbfff;
            margin-left: 6%;
          }
        }
      }
    }
  }
</style>
<script>
  import functions from '../../functions'
  export default {
    name: 'cogitionclass',
    created () {
      window.back = this.prev
      try {
        window.$.invoke('toggleNavigation', { isShow: false })
        window.$.invoke('setTitle', { title: '认知' })
      } catch (e) {

      }
      this.renderData()
    },
    data () {
      return {
        isShow: true,
        resultShow: false,
        weekShow: false,
        loadingShow: true,
        items: [],
        students: [],
        weekArr: [],
        lastWeek: -1,
        weekNames: '一二三四五六七八'.split(''),
        weekEnNames: {
          'one': 0,
          'two': 1,
          'three': 2,
          'four': 3,
          'five': 4,
          'six': 5,
          'seven': 6,
          'eight': 7
        }
      }
    },
    methods: {
      renderData: function () {
        var token = functions.getParam('token')
        var self = this
        var sendData = {
          access_token: token,
          class_id: self.$route.params.class_id
        }
        this.$http.jsonp(
          functions.getURL('cognize/class-report'),
          {
            params: sendData
          }).then(
            function (obj) {
              var results = obj.data.data
              try {
                self.items.push(results.class)
                var count = 0
                for (var w in results.week) {
                  count += parseInt(results.week[w])
                  console.log(self.lastWeek)
                  if ((parseInt(results.week[w]) > 0) && (typeof self.weekEnNames[w] !== 'undefined') && (self.weekEnNames[w] > self.lastWeek)) {
                    self.lastWeek = self.weekEnNames[w]
                  }
                }
                if (count === 0) {
                  self.resultShow = true
                  self.loadingShow = false
                } else {
                  self.resultShow = false
                }
                for (var key in results.week) {
                  self.weekArr.push(results.week[key])
                }
                for (var i = 0; i < results.cognize.length; i++) {
                  for (var j = 0; j < results.cognize[i].length; j++) {
                    results.cognize[i][j]['class_name'] = results.class.class_name
                    results.cognize[i][j].finish = results.cognize[i][j].finish.substr(0, 3)
                    results.cognize[i][j].last_warning_level = results.cognize[i][j].last_warning_level.substr(0, 1)
                    self.students.push(results.cognize[i][j])
                  }
                }
                console.log(self.students)
                if (self.students.length === 0) {
                  self.loadingShow = true
                } else {
                  self.loadingShow = false
                }
                self.delay()
              } catch (e) {

              }
            }, function () {
              window.$.invoke('showMessage', { message: '网络请求失败' })
            })
      },
      delay: function () { // 解决静态html先于动态加载数据显示问题
        var start = new Date()
        var end = ''
        var time = ''
        var self = this
        window.setTimeout(function () {
          if (document.readyState === 'complete') {
            end = new Date()
            time = end.getTime() - start.getTime()
            console.log(end.getTime() - start.getTime())
            self.weekShow = true
          }
        }, time)
      },
      prev: function (event) {
        this.$router.go(-1)
      }
    }
  }

</script>
