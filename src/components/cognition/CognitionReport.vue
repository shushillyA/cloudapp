<template>
  <div class='wrap'>
    <div class='title'></div>
    <div class='content'>
      <section class='shell'>
        <div id='person'>
          <p id='name'>{{realname}}</p>
          <p id='class'>{{class_name.fullName}}</p>
          <p id='progress'>进度{{finish}}</p>
          <img src='../../assets/row.png' id='row_img'>
        </div>
        <div id='relate'>
          <h2>末次预警<span>{{last_warning_level}}</span></h2>
          <h2>激活事件<span>{{solution_id}}</span></h2>
          <h2>获取锦囊<span>{{clothbag_id}}</span></h2>
        </div>
      </section>
      <section id='slide_container'>
        <section id='slide_banner'>
          <ul id='week' >
            <li v-for='(number, index) in numbers' v-bind:class="selectedWeek === index ? 'week_selected' : ''" v-on:click='selectedWeek = index'><span>第{{number}}周</span><span></span></li>
          </ul>
        </section>
      </section>

      <section class='shell'>
        <section id='noMsg' v-if='!weekDetail'>暂无本周练习</section>
        <template v-if='weekDetail'>
          <section class='analysis' v-if='weekDetail.warning_level'>
            <h2>当前预警</h2>
            <div>{{weekDetail.warning_level}}</div></section>
          <section class='analysis' v-if='weekDetail.gloomy'>
            <h2>心境指数<span><img v-for="item in new Array(weekDetail.gloomy.level)" src='../../assets/heart.png'></span></h2>
            <div>{{weekDetail.gloomy.mood_des}}</div>
          </section>
          <section class='analysis' v-if='weekDetail.mood'>
            <h2>情绪指数<span><img v-for="item in new Array(weekDetail.mood.level)" src='../../assets/heart.png'></span></h2>
            <div>{{weekDetail.mood.mood_des}}</div>
          </section>
          <section class='analysis' v-if='weekDetail.lifeevent'>
            <h2>生活事件</h2>
            <img :src="'https://cloudcgncdn.xlhb.com/static/lefactors/icon_0' + weekDetail.lifeevent + '.png'" id='life_img'>
          </section>
          <section class='analysis' v-if='weekDetail.attitude'>
            <h2>生活态度</h2>
            <div>{{weekDetail.attitude}}</div>
          </section>
          <section class='analysis' v-if='weekDetail.clothbag_img'>
            <h2>获得锦囊</h2>
            <img :src="'https://cloudcgncdn.xlhb.com' + weekDetail.clothbag_img" id='bag_img'>
          </section>
          <section class='analysis' v-if='weekDetail.monster_img'>
            <h2>击败情绪兽</h2>
            <img :src="'https://cloudcgncdn.xlhb.com' + weekDetail.monster_img" id='animal_img'>
          </section>
          <section class='analysis' v-if='weekDetail.item_content'>
            <h2>获得正能量语录</h2>
            <ul>
              <li v-for='item in weekDetail.item_content'>{{item}}</li>
            </ul>
          </section>
          <section class='analysis' v-if='weekDetail.summary'>
            <h2>学生感想</h2>
            <div>{{weekDetail.summary}}</div>
          </section>
        </template>
      </section>
    </div>
  </div>

</template>
<style scoped>
.title{
  width:100%;
  height:6rem;
  background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
}
.content{
  margin-top:-4rem;
  margin-bottom:8rem;
}
#person{
  line-height:4rem;
  overflow:hidden;
  position:relative;
}
.warnsign_img{
    float: left;
    width: 2.4rem;
    margin-top: 0.8rem;
    margin-right: 0.5rem;
}
#row_img{
 width:1rem;
 position: absolute;
 right: 1rem;
 top: 1.4rem;
}
#name{
	     float: left;
    width: 26%;
    height: 3rem;
    font-size: 2rem;
    color: #6c7079;
    margin: 0 0.6rem;
    overflow: hidden;
}
#class{
    float: left;
    width:28%;
    color: #bdc0c7;
    font-size: 1.8rem;
}
#progress{
     float: right;
    width: 20%;
    color: #bdc0c7;
    font-size: 1.8rem;
    text-align: right;
    margin-right:10%;
}
#relate{
  overflow: hidden;
}
#relate h2{
  width:33%;
  font-size:1.8rem;
  color:#aaaab9;
  float:left;
  text-align:center;
  line-height:3rem;
}
#relate h2 span{
  color:#3dbfff;
  margin-left:6%;
}
#slide_container {
  width: 92%;
    margin: 0 4%;
    background-color: #fff;
    border-radius: 1.8rem;
    box-shadow: 0 0 1.6rem #3dbeff;
        margin-bottom: 1rem;
  overflow:hidden;
}
#slide_banner{
  padding:0 4%;
  overflow-x:scroll;
}
#week{
 width:64rem;
 height:7rem;
}
#week li{
  float:left;
  width:8rem;
  font-size:2rem;
  line-height:6.85rem;
  text-align:center;
}

#week li span:nth-child(1){
  height:2rem;
  color:#c2c3d8;
}

#week .week_selected span:nth-child(1){
  color:#6c7079;
}

#week li span:nth-child(2){
  width:40%;
  height:2px;
  background-color:#3dbfff;
  margin:0 auto;
  display:none;
}

#week li.week_selected span:nth-child(2){
  display:block;
}

.analysis h2{
  font-size:2rem;
  color:#6c7079;
}
.analysis h2 img{
  width:3rem;
  float:right;
}
.analysis div{
    font-size: 1.8rem;
    color: #a5a6bb;
    line-height: 2.5rem;
    padding: 1.2rem 0 2rem 0;
}
.analysis ul{
  padding-bottom:2rem;
}
.analysis li{
    font-size: 1.8rem;
    color: #a5a6bb;
    line-height: 2.5rem;
    padding-top:1rem;
}
#life_img,#bag_img,#animal_img{
  margin: 1rem 0 2rem 0;
}
#noMsg {
  font-size: 2rem;
  color:#a5a6bb;
  line-height:5rem;
}

</style>
<script>
import functions from '../../functions'
export default {
  name: 'cognitionreport',
  data () {
    return {
      // baseicInfo: '',
      now_warning_level: '',
      realname: '',
      class_name: '',
      finish: '',
      last_warning_level: '',
      clothbag_num: '',
      exercise_num: '',
      line_show: false,
      items: [],
      numbers: '一二三四五六七八'.split(''),
      selectedWeek: 0,
      weekDetails: '',
      weekDetail: ''
    }
  },
  created () {
    this.renderData()
    window.back = this.prev
    console.log(self.weekDetail)
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '认知报告' })
    } catch (e) {
    }
  },
  watch: {
    selectedWeek: function (newVal, oldVal) {
      this.weekDetail = this.weekDetails[newVal]
    }
  },
  methods: {
    renderData: function () {
      var self = this
      var token = functions.getParam('token')
      var sendData = {
        access_token: token,
        user_id: self.$route.params.user_id
      }
      self.now_warning_level = self.$route.params.now_warning_level
      self.realname = self.$route.params.realname
      self.class_name = self.$route.params.class_name
      self.finish = self.$route.params.finish
      if (self.$route.params.last_warning_level.length === 1) {
        self.last_warning_level = self.$route.params.last_warning_level
      } else {
        self.last_warning_level = self.$route.params.last_warning_level.substr(0, 1)
      }
      self.clothbag_id = self.$route.params.clothbag_id
      self.solution_id = self.$route.params.solution_id
      this.$http.jsonp(
        functions.getURL('cognize/person-report'),
        {
          params: sendData
        }).then(
          function (obj) {
            console.log(obj, '收到的数据')
            self.weekDetails = new Array(8)
            var weekDetails = obj.data.data.cognize
            for (var week in weekDetails) {
              let m = week.match(/a([1-8])/)
              if (m) {
                self.weekDetail = weekDetails[week]
                if (self.weekDetail.gloomy && self.weekDetail.gloomy.level) {
                  self.weekDetail.gloomy.level = parseInt(self.weekDetail.gloomy.level)
                }

                if (self.weekDetail.mood && self.weekDetail.mood.level) {
                  self.weekDetail.mood.level = parseInt(self.weekDetail.mood.level)
                }

                if (self.weekDetail.item_content) {
                  for (var i = 0; i < self.weekDetail.item_content.length; i++) {
                    self.weekDetail.item_content[i] = i + 1 + '、' + self.weekDetail.item_content[i]
                  }
                }
                self.weekDetails[m[1] - 1] = self.weekDetail
              }
              console.log(self.weekDetails)
            }
          }, function () {
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
    },
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
    }
  }
}
</script>
