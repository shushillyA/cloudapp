<template>
  <div class='wrap'>
    <div class="top_bgc">

    </div>
    <div class='content'>
      <section class='shell' v-for='item in items'>
        <img v-if="item.sex==='女'" src='../../assets/male.png' class='male'>
        <img v-if="item.sex==='男'" src='../../assets/female.png' class='female'>
        <div id='person'>
          <p id='name'>{{item.name}}</p>
          <p id='age'>{{item.age}}岁</p>
          <p id='class'>{{item.class_name.fullName}}</p>
          <p id='number'>第{{item.report_no}}次</p>
        </div>
        <div id='talk'>
          <p id='date'>开始时间:{{item.create_time}}</p>
          <p id='time'>用时:{{item.costtime}}</p>
        </div>
      </section>
      <section class='shell'>
        <div class='head' v-on:click="changeList('explainShow')">
          <h2><span></span>报告阅读说明<img src='../../assets/row_down.png' id='rowimg' :style="explainShow?'':'transform:rotate(-90deg)'"></h2>
        </div>
        <div class='detail' v-show='explainShow'>
          沙盘游戏的意义在于：咨询师在理解作品象征意义的基础上，体验来访者的情绪情感，促进其心理的发展与变化。来访者则运用各种沙具将自己无形的心理有形化，在治疗者的帮助下观察自己的内心世界，整合自我。<br>本报告将提供沙盘作品的原始数据及详细信息，以及沙盘作品中可能含有的重要象征意义，作为咨询师分析作品时的参考。<br>咨询师在分析作品时应当首先思考整个沙盘作品所表达的意义，然后再进行对特定沙具的象征意义分析。同时，来访者自身对沙盘的评价在沙盘的分析中是非常重要且具有参考性的，如沙盘作品中仍有咨询师感兴趣或是感到不明确的部分，应向来访者提问。最后，沙盘游戏是一个渐进的过程，分析作品时应多观察，思考多次沙盘作品所表现出的总体趋势。<br> 沙盘的制作会受到来访者制作时的应激状态、自身的心境、外部环境等的影响，本报告只能通过一定的理论和方法对沙盘作品所表达的内容进行推测，咨询师不应以此给予来访者直接定性。
        </div>
      </section>
      <section class='shell'>
        <div class='head' v-on:click="changeList('evaluateShow')">
          <h2><span></span>来访者的评价<img src='../../assets/row.png' :style="evaluateShow?'transform:rotate(90deg)':'transform:rotate(0deg)'"></h2>
        </div>
        <div class='detail' v-show='evaluateShow'>
          <ul id='evaluate' v-for='answer in evaluate'>
            <li><span>1</span>来访者对沙盘作品的命名：{{answer.answer1}}</li>
            <li><span>2</span>沙盘中代表来访者的沙具：{{answer.answer2}}</li>
            <li><span>3</span>对来访者意义最大的沙具：{{answer.answer3}}</li>
            <li><span>4</span>来访者最喜爱的沙具：{{answer.answer4}}</li>
            <li><span>5</span> 其他来访者希望说明含义的沙具：{{answer.answer5}}</li>
            <li><span>6</span>来访者完成作品过程中的感受：{{answer.answer6}}</li>
          </ul>
        </div>
      </section>
      <section class='shell'>
        <div class='head'  v-on:click="changeList('printscreenShow')">
          <h2><span></span>沙盘作品截图<img src='../../assets/row.png' :style="printscreenShow?'transform:rotate(90deg)':'transform:rotate(0deg)'"></h2>
        </div>
        <div class='detail' v-show='printscreenShow'>
          <ul>
            <li v-for='sandImg in sandImgs'><img :src='sandImg.url'></li>
          </ul>
        </div>
      </section>
      <section class='shell'>
        <div class='head' v-on:click="changeList('surveyShow')">
          <h2><span></span>沙盘作品概况<img src='../../assets/row.png' :style="surveyShow?'transform:rotate(90deg)':'transform:rotate(0deg)'"></h2>
        </div>
        <div class='detail' v-show='surveyShow'>
          <ul id='survey'>
            <li>沙具使用总数<span>{{modelcount}}</span></li>
            <li>沙具变动次数<span>{{movecount}}</span></li>
            <li>沙具分布预警<span><img src='../../assets/sign.png' v-show='isSign' id='signImg'>{{mapinfo_warning}}</span></li>
            <li id='line'></li>
          </ul>
          <div id='becare'>
            <h2>注意:</h2>
            <ul>
              <li><span>使用沙具的总数出现</span><span><img src='../../assets/sign.png'></span><span>时说明作品中的沙具数量过多或过少</span></li>
              <li><span>移动/删除沙具的次数出现</span><span><img src='../../assets/sign.png'></span><span>时说明作品中移动/删除的沙具次数过多</span></li>
              <li><span>沙具的分布出现</span><span><img src='../../assets/sign.png'></span><span>时说明沙盘中存在空洞部分</span></li>
            </ul>

          </div>
        </div>
      </section>
      <section class='shell'>
        <div class='head' v-on:click="changeList('listShow')">
          <h2><span></span>摆放/移动列表<img src='../../assets/row.png' :style="listShow?'transform:rotate(90deg)':'transform:rotate(0deg)'"></h2>
        </div>
        <div class='detail' v-show='listShow'>
          <ul>
            <li v-for='list in lists' id='single'><p>{{list.model_set}}</p><p>{{list.used_time}}</p></li>
          </ul>
        </div>
      </section>
      <section class='shell'>
        <div class='head' v-on:click="changeList('analysisShow')">
          <h2><span></span>沙具意义分析<img src='../../assets/row.png' :style="analysisShow?'transform:rotate(90deg)':'transform:rotate(0deg)'"></h2>
        </div>
        <div class='detail' v-show='analysisShow'>
          <ul v-for='analysis in analyses'>
            <li>{{analysis.content1}}</li>
            <li>{{analysis.content2}}</li>
            <li>{{analysis.content3}}</li>
          </ul>
        </div>
      </section>
      <section class='shell' v-show='teaShow'>
        <div class='head' v-on:click="changeList('remarkShow')">
          <h2><span></span>老师备注<img src='../../assets/row.png' :style="remarkShow?'transform:rotate(90deg)':'transform:rotate(0deg)'"></h2>
        </div>
        <div class='detail' v-show='remarkShow'>
          <ul>
            <li>{{factorExplain}}</li>
            <li>{{suggest}}</li>
            <!--<li v-html='suggest'></li>-->
          </ul>
        </div>
      </section>
      <div class='empty'></div>
    </div>
  </div>
</template>
<style scoped>
.top_bgc{
    height:5rem;
    width: 100%;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
}
/*个人信息*/
.content{
  width:100%;
  height:100%;
   margin-top: -3rem;
   margin-bottom:8rem;
}
.male{
   width: 3.5%;
    float: left;
    margin: 0.5rem 3% 0rem 1%;
}
.female{
    width: 5%;
    float: left;
    margin: 0.5rem 2% 0rem 1%;
}
#person{
width:92%;
float:left;
height:2.2rem;
line-height:2.5rem;
}
#name{
float:left;
font-size:1.8rem;
color:#6c7079;
}
#age {
  float:left;
font-size:1.6rem;
color:#bdc0c7;
margin-left:1rem;
}
#class{
float:left;
font-size:1.6rem;
color:#bdc0c7;
margin-left:1rem;
width: 40%;
    height: 3rem;
    overflow: hidden;
}
#date {
 font-size:1.5rem;
 color:#bdc0c7;
 float:left;
}
#talk{
line-height:2.5rem;
margin-left:8%;
}
#number {
float:right;
  font-size:1.5rem;
  color:#3dbfff;
}
#time {
  float:right;
  font-size:1.5rem;
   color:#bdc0c7;
}
.head h2{
  font-size:1.6rem;
  color:#a5a6bb;
  line-height:2.5rem;
}
.head h2 span{
  display:inline-block;
  width:0.7rem;
  height:0.7rem;
  border-radius:0.35rem;
  background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
  box-shadow: 0 0 0.2rem #56dcf9;
  margin-right:1rem;
}
.head h2 img{
    width: 1rem;
    float: right;
    margin-top:0.7rem;
}
.detail{
  font-size:1.6rem;
  color:#a5a6bb;
  line-height: 3rem;
  margin: 0.4rem 0 1rem 0;
}
#evaluate span{
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 0.8rem;
    background-color: #d0d4dc;
    text-align: center;
    line-height: 1.6rem;
    display: inline-block;
    color: #fff;
    font-size: 1.4rem;
    margin-right: 0.4rem;
}
.detail img{
width:100%;
height:100%;
}
#survey span{
  float:right;
  color:#29bfff;
}
#signImg{
  float:left;
  width:3rem;
}
#line{
  width:100%;
  height:2px;
  background-color:#dcdde1;
  margin:1rem 0;
}
#becare h2{
  font-size:2rem;
  color:#6c7079;
}
#becare span:nth-child(1){
  float:left;
}
#becare img{
  width:3rem;
  float:left;
}
.show_sand{
  width:33%;
  line-height:2rem;
  float:left;
  font-size:1.1rem;
  text-align:center;
}
.show_sand p:nth-child(1) {
  background-color:skyblue;
}
.show_sand p:nth-child(2) {
  line-height:3rem;
}
#single{
  width:100%;
  line-height:3rem;
  clear:both;
}
#single p:nth-child(1) {
  float:left;
}
#single p:nth-child(2) {
  float:right;
  color:#3dbfff;
}
.empty{
  height:10rem;
}
</style>
<script>
import functions from '../../functions'
export default {
  name: 'sandreport',
  data () {
    return {
      explainShow: true,
      evaluateShow: false,
      printscreenShow: false,
      surveyShow: false,
      listShow: false,
      analysisShow: false,
      remarkShow: false,
      teaShow: false,
      items: [],
      explains: [],
      evaluate: [],
      sandImgs: [],
      analyses: [],
      mapinfo_warning: '',
      isSign: false,
      modelcount: '',
      movecount: '',
      lists: [],
      suggest: '',
      factorExplain: '',
      sex_class: ''
    }
  },
  created () {
    this.renderData()
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '沙盘报告' })
    } catch (e) {
    }
    document.body.scrollTop = 0
  },
  methods: {
            // 渲染数据
    renderData: function () {
      var self = this
        // 渲染数据
      // var token = functions.getParam('token')
      var params = this.$route.params
      params.create_time = functions.getWeekDay(params.create_time * 1000).substr(0, 10)
      console.log(params.sex)
      this.items.push(params)
      this.$http.jsonp(functions.getURL('sand/detail'), functions.sendParam({'report_id': params.report_id})).then(function (obj) {
        obj = obj.data
        try {
          self.analyses.push(obj.data.content.type1)
          self.analyses.push(obj.data.content.type2)
          self.analyses.push(obj.data.content.type3)
          self.evaluate.push(obj.data.evaluate)
          self.sandImgs = obj.data.sand_imges
          self.movecount = obj.data.gener.movecount
          self.modelcount = obj.data.gener.modelcount
          if (obj.data.gener.mapinfo_warning === '是') {
            obj.data.gener.mapinfo_warning = '有空洞部分'
            self.isSign = true
          } else {
            obj.data.gener.mapinfo_warning = '无空洞部分'
            self.isSign = false
          }
          self.mapinfo_warning = obj.data.gener.mapinfo_warning
          self.lists = obj.data.sand_mode
          if (obj.data.sand_imges_psytrait.length === 0) {
            self.teaShow = false
          } else {
            self.teaShow = true
            self.factorExplain = obj.data.sand_imges_psytrait.factorExplain[0]
            self.suggest = obj.data.sand_imges_psytrait.suggest[0]
          }
        } catch (e) {

        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    formatSeconds: function (value) {
      var theTime = parseInt(value)// 秒
      var theTime1 = 0// 分
      var theTime2 = 0// 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
        }
      }
      var result = '' + parseInt(theTime) + '秒'
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      return result
    },
    changeList: function (showType) {
      console.log(showType)
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
