<template>
  <div class="wrap">
    <section class="search">
</section>
    <div class='content'>
      <section class='shell single'  v-for='(item, $index) in items' :key='item.created_time'>
        <img v-show="item.is_warning==='1'" src='../../assets/warnSign.png'>
        <div id='person'>
          <p class='name'>{{item.realname}}</p>
          <p class='class'>{{item.classname}}</p>
          <!--班主任或教育局申请查看时才显示 audit_headmaster_apply/audit_educ_apply班主任教育局是否申请  1是申请中-->
          <div v-if='(item.headmaster_apply_status==="1" || item.educ_apply_status==="1") && role==="PSYCHOLOGY_TEACHER"'>
            <div class='deal_audit' v-on:click='dealLayer(item, $index)' v-if='$index !== i'>处理申请</div>
            <p class='choosed' v-if='$index === i || item.headmaster_apply_status==="2" || item.headmaster_apply_status==="3"'>已{{choice}}</p>
          </div>
          <div v-if='role==="PSYCHOLOGY_TEACHER"'>
            <p class='choosed' v-if='item.headmaster_apply_status==="2"'>已通过</p>
            <p class='choosed' v-if='item.headmaster_apply_status==="3"'>已拒绝</p>
          </div>
          <div class="deal" v-if='item.headmaster_apply_status==="1" && layerShow_headermaster && $index === i' transition='fade'>
            <div @click.stop="">
              <p class="choice">班主任：{{item.headmastername}}<br>申请查看该学生的行为记录</p>
              <span class='deny' @click='chooseTeach("拒绝", item, "3")'>拒绝</span>
              <span @click='chooseTeach("通过", item, "2")'>通过</span>
            </div>
          </div>
          <div class="deal" v-if='item.educ_apply_status==="1" && layerShow_educ && $index === i' transition='fade'>
            <div @click.stop="">
              <p class="choice">{{eduName}}教育局<br>申请查看该学生的干预报告</p>
              <span class='deny' @click='chooseEduc("拒绝", item, "3")'>拒绝</span>
              <span @click='chooseEduc("通过", item, "2")'>通过</span>
            </div>
          </div>
          <p class='looker' v-if='(role==="PSYCHOLOGY_TEACHER" && item.teachername==="班主任" && item.headmaster_apply_status!=="1") || (role==="CLASS_TEACHER" && item.teachername==="心理老师" && item.headmaster_apply_status!=="1")'>{{item.teachername}}</p>
        </div>
        <section class='section'>
          <div>
            <span class='time_point'><i class='line' v-if='item.deal_suggest_content !== null && role==="PSYCHOLOGY_TEACHER"'></i></span><p class='time'>{{item.created_time}}</p>
          </div>
          <div class='apply' v-if='item.headmaster_apply_status==="0"&& role==="CLASS_TEACHER" && item.teachername==="心理老师"'> <!--班主任角色且班主任未申请查看-->
            <h2>该记录需向心理老师提交申请方可查看</h2>
            <div v-on:click.once='apply_audit(item, $event)' class='apply_no'>申请查看</div>
          </div>
          <div class='apply' v-if='item.headmaster_apply_status==="1"&& role==="CLASS_TEACHER" && item.teachername==="心理老师"'> <!--班主任角色且班主任申请审核中-->
            <h2>该记录需向心理老师提交申请方可查看</h2>
            <div class='apply_yes'>审核中</div>
          </div>
          <div class='apply_deny' v-if='item.headmaster_apply_status==="3" && role==="CLASS_TEACHER"'><h2>审核不通过</h2></div>
          <!--班主任查看心理老师记录的审核通过  班主任查看自己记录的   心理老师查看记录 （teachername,headmastername同时存在是班主任申请查看心理老师记录的，只有teachername时是班主任或心理老师查看自己记录的）-->
            <div class='detail' v-if='(item.headmaster_apply_status==="2" && role==="CLASS_TEACHER") || (item.headmaster_apply_status==="0" && role==="CLASS_TEACHER" && item.teachername==="班主任") || role==="PSYCHOLOGY_TEACHER"'>
            <div v-if="item.behaviors || item.behaviorMemo">
              <div>
                <h2>异常表现</h2>
                <ul>
                  <li v-for='behavior in item.behaviors'><span></span>{{behavior}}</li>
                </ul>
              </div>
              <div>{{item.behaviorMemo}}</div>
            </div>
            <div v-if="item.events || item.eventMemo">
              <div>
                <h2>生活事件</h2>
                <ul>
                  <li v-for='event in item.events'><span></span>{{event}}</li>
                </ul>
              </div>
              <div>{{item.eventMemo}}</div>
            </div>
          </div>
        </section >
        <section v-if='item.deal_suggest_content !== null && item.deal_suggest_content !== "" && role==="PSYCHOLOGY_TEACHER"  && item.deal_suggest_content !=="未处理" && item.is_warning !== "0"' class='section'>
          <div>
            <span class='time_point'><i class='line' v-if='item.deal_result_content !== null && role==="PSYCHOLOGY_TEACHER"'></i></span><p class='time'>{{item.suggest_time}}</p>
          </div>
          <div class='step'>
            <div>
              <div>
                <h2>干预措施</h2>
                <p v-if='item.deal_suggest_content ==="未处理"'>未处理</p>
                <div v-for='suggest in item.suggests'>
                  <p><span></span>{{suggest.title}}</p>
                  <p>{{suggest.content}}</p>
                </div>
                <div class='mark'>{{item.suggestMemo}}</div>
              </div>
            </div>
          </div>
        </section>
        <section v-if='item.deal_result_content !== null && item.deal_result_content !== "" && role==="PSYCHOLOGY_TEACHER"' class='section'>
          <div>
            <span class='time_point'></span><p class='time'>{{item.result_time}}</p>
          </div>
          <div class='result'>
            <div>
              <div>
                <h2>干预结果</h2>
                <div v-for='result in item.results'>
                  <p><span></span>{{result}}</p>
                </div>
                <div class='mark'>{{item.resultMemo}}</div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .content{
    width:100%;
    height:100%;
    position:relative;
    margin-top: -7rem;
  }
  .single{
    padding-bottom:3rem;
  }
  .single img{
    width:2rem;
    float:left;
    margin-top:0.5rem;
  }
  #person {
    height:3rem;
  }
  .name{
        float: left;
      width: 28%;
      height:3rem;
      line-height:3rem;
      font-size: 1.8rem;
      color: #6c7079;
      margin: 0 0.6rem;
      overflow:hidden;
  }
  .class{
      float: left;
      width:26%;
      line-height:3rem;
      color: #bdc0c7;
      font-size: 1.6rem;
      text-align:center;
      height: 3rem;
      text-overflow: ellipsis;
      overflow: hidden;
  }
  .deal_audit{
    float: right;
      width: 22%;
      height: 3rem;
      line-height: 3rem;
      color: #3dbfff;
      border: 1px solid #3dbfff;
      font-size: 1.6rem;
      text-align: center;
  }
  .time{
    font-size:1.8rem;
    height:4rem;
    line-height:4rem;
    color:#3dbfff;
  }
  .choosed{
    float: right;
      /*width: 22%;*/
      height: 3rem;
      line-height: 3rem;
      color: #bdc0c7;
      font-size: 1.6rem;
      text-align: center;
  }
  .looker{
    float: right;
      /*width: 42%;*/
      height: 3rem;
      line-height: 3rem;
      color: #bdc0c7;
      font-size: 1.6rem;
      text-align: right;
  }
  .detail, .step,.result,.apply_deny{
    margin-left:2.6rem;
  }
  .time_point{
    display: inline-block;
      width: 1.2rem;
      height: 1.2rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
      box-shadow: 0 0 0.5rem #56dcf9;
      border-radius: 0.5rem;
      float: left;
      margin: 1.3rem 1rem 0 0.4rem;
      position:relative;
  }
  /*进度条*/
  .time_point i{
      position: absolute;
      width: 2px;
      background-color: #12cbff;
      top: 0;
      right: 0;
      -webkit-transform: translateY(-5px);
      transform: translate(-6px,13px);
  }
  .detail h2,.step h2,.result h2,.apply h2,.apply_deny h2{
        line-height: 3rem;
      font-size: 1.8rem;
      color: #6c7079;
      margin-bottom:1rem;
  }
  .apply h2{
    text-align:center;
  }
  ul{
    width:100%;
    overflow: hidden;
  }
  .detail li,.result li{
      float: left;
      width: 33.33%;
      font-size: 1.8rem;
      line-height: 2.5rem;
      color: #a5a6bb;
  }
  .step p{
      font-size: 1.8rem;
      line-height: 2.5rem;
      color: #a5a6bb;
  }
  .mark{
      font-size: 1.8rem;
      line-height: 2.5rem;
      color: #a5a6bb;
  }
  .detail li span,.step span,.result span{
  display:inline-block;
    width:1rem;
    height:1rem;
    background-color:#e1e1e1;
    border-radius:0.5rem;
    margin-right:0.5rem;
  }
  .detail div, .step div, .result div{
    font-size:1.8rem;
    color:#a5a6bb;
    line-height:2.5rem;
    word-wrap: break-word;
    margin-bottom:1rem;
  }
  .apply_yes{
    width:90%;
    height:3rem;
    line-height:3rem;
    border:1px solid #a5a6bb;
    text-align:center;
    color:#a5a6bb;
    margin: 0 auto;
    font-size: 1.6rem;
  }
  .apply_no{
    width:90%;
    height:3rem;
    line-height:3rem;
    border:1px solid #3dbfff;
    text-align:center;
    color:#3dbfff;
    margin: 0 auto;
    font-size: 1.6rem;
  }
  /*刷新加载*/
  #pull-header p{
    font-size:1.6rem;
    color:#fff;
  }
  #pull-footer p{
    font-size:1.6rem;
    color:#3dbfff;
  }
  /*弹出层*/
  .deal{
      z-index: 1;
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: block;
      background: rgba(0,0,0,0.6);
  }
  .deal div{
      width: 70%;
      height: 12rem;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%,200%);
      border-radius: 6px;
  }
  .deal .choice{
      font-size: 1.6rem;
      color: #626370;
      width: 100%;
      height: 8rem;
      line-height: 2.5rem;
      text-align: center;
      border-bottom: 1px solid #d9d9d9;
      padding-top: 1.5rem;
  }
  .deal span{
    height:4rem;
    line-height:4rem;
    width:50%;
    color:#3dbfff;
    font-size:1.6rem;
    display:inline-block;
    float:left;
    text-align:center;
  }
  .deny{
    border-right:1px solid #d9d9d9;
  }




</style>
<script>
import functions from '../../functions'
// import Vue from 'vue'
// var AUDIT_URL = 'https://cloudappapi.test.xlhb.com/v1/record/audit-apply-record.api?access_token=' // 心理老师处理申请
// var APPLYSEE_URL = 'https://cloudappapi.test.xlhb.com/v1/record/apply-see-record.api?access_token=' // 班主任申请查看行为记录
// var token = functions.getParam('token')
// var url
export default {
  name: 'recorddetail',
  data () {
    return {
      items: [],
      textShow: false,
      layerShow_headermaster: false,
      layerShow_educ: false,
      choice: '',
      role: '',
      teachername: '',
      i: -1,
      classItem: [],
      eduName: ''
    }
  },
  created () {
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '记录详情' })
    } catch (e) {
    }
    window.back = this.prev
    this.role = this.$store.state.role
    this.dealResultShow = this.$store.state.dealShow
    this.renderData()
  },
  mounted () {
    var shells = document.getElementsByClassName('shell')
    for (var i = 0; i < shells.length; ++i) {
      var shell = shells[i]
      var sections = shell.getElementsByClassName('section')
      var lines = shell.getElementsByClassName('line')
      for (var j = 0; j < sections.length - 1; ++j) {
        lines[j].style.height = sections[j].offsetHeight + 'px'
      }
    }
  },
  methods: {
    recordRenderData: function (object, item, item2) {
      if (object[item]) {
        object[item2] = object[item].replace(/\s*(?:<br>)?\s*备注：.*$|\s*(?:<br>)?\s*$/, '').split(/\s*,\s*/)
        if (object[item2].length === 1 && object[item2][0].length === 0) {
          delete object[item2]
        }
      }
    },
    renderData: function () {
      var record = this.$route.query.items
      console.log(this.$route.query.items)
      for (var i = 0; i < record.length; i++) {
        this.recordRenderData(record[i], 'behavior_label', 'behaviors')
        this.recordRenderData(record[i], 'b_content', 'behaviors')
        record[i].behaviorMemo = record[i].behavior_content
        this.recordRenderData(record[i], 'element_label', 'events')
        this.recordRenderData(record[i], 'e_content', 'events')
        record[i].eventMemo = record[i].element_content
        if (record[i].deal_suggest_content && record[i].deal_suggest_content !== '未处理') {
          var suggestsTemp = record[i].deal_suggest_content.replace(/\s*(?:<br>)?\s*备注：.*$|\s*(?:<br>)?\s*$/, '').split(/\s*;\s*/)
          record[i].suggestMemo = record[i].deal_suggest_content.split('备注：')[1]
          console.log(record[i].suggestMemo)
          var suggestObj = {title: '', content: ''}
          record[i].suggests = []
          for (var m = 0; m < suggestsTemp.length - 1; m++) {
            suggestObj = {}
            suggestObj.title = suggestsTemp[m].split('(')[0]
            suggestObj.content = suggestsTemp[m].match(/\(([\s\S]*?)\)/)[1]
                // suggestObj.content = 'dsf'
            record[i].suggests.push(suggestObj)
          }
            // }
          // }
        }
        if (record[i].deal_result_content) { // 干预结果
          // if (record[i].deal_result_content !== null) {
          record[i].results = record[i].deal_result_content.replace(/\s*(?:<br>)?\s*备注：.*$|\s*(?:<br>)?\s*$/, '').split(/\s*;\s*/)
          record[i].resultMemo = record[i].deal_result_content.split('备注：')[1]
          console.log(record[i].resultMemo)
          // }
        }
        // record[i].headmaster_apply_time = functions.getWeekDay(record[i].headmaster_apply_time * 1000).substr(0, 16)
        // record[i].audit_headmaster_apply_time = functions.getWeekDay(record[i].audit_headmaster_apply_time * 1000).substr(0, 16)
        record[i].teachername = record[i].teachername.split('：')[0]
        if (record[i].deal_suggest_time) {
          record[i]['suggest_time'] = (functions.getWeekDay(parseInt(record[i].deal_suggest_time) * 1000)).substr(0, 16)
        }
        if (record[i].deal_result_time) {
          record[i]['result_time'] = (functions.getWeekDay(parseInt(record[i].deal_result_time) * 1000)).substr(0, 16)
        }
        this.items.push(record[i])
      }
      console.log(this.items)
    },
    dealLayer: function (item, index) { // 弹出层
      var token = functions.getParam('token')
      if (!this.layerShow_headermaster) {
        this.layerShow_headermaster = true
      }
      if (!this.layerShow_educ) {
        this.layerShow_educ = true
      }
      var self = this
      this.i = index // 控制当前点击对象的状态或样式
      var EDNNAME_URL = 'https://cloudappapi.test.xlhb.com/v1/edu-bwarning/get-school-name.api?access_token=' // 获取教育局名字
      EDNNAME_URL = EDNNAME_URL + token + '&id=' + item.educ_id_apply
      // EDNNAME_URL = EDNNAME_URL + token + '&id=' + 1
      console.log(EDNNAME_URL, '教育局接口')
      window.$.jsonp(EDNNAME_URL, function (obj) {
        console.log(obj, '教育局')
        try {
          // console.log(obj.data['1'], 'lalalallalalaalall')
          self.eduName = obj.data['1'].name
        } catch (e) {
          console.log('数据报错')
        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    dealData: function (content) {
      if (content) {
        content.replace(/\s*(?:<br>)?\s*备注：.*$|\s*(?:<br>)?\s*$/, '').split(/\s*,\s*/)
      }
    },
    chooseTeach: function (choice, item, status) {
      var token = functions.getParam('token')
      var AUDIT_URL = 'https://cloudappapi.test.xlhb.com/v1/record/audit-apply-record.api?access_token=' // 心理老师处理申请
      this.choice = choice
      var url
      // url = AUDIT_URL + token + '&record_id=' + item.record_id + '&org_id=' + item.org_id + '&role=' + '2' + '&educ_apply_status=' + item.educ_apply_status + '&audit_status=' + status
      if (this.layerShow_headermaster) {
        url = AUDIT_URL + token + '&record_id=' + item.record_id + '&role=' + '1' + '&headmaster_apply_status=' + item.headmaster_apply_status + '&audit_status=' + status
      }
      // url = AUDIT_URL + token + '&record_id=' + item.record_id + '&role=' + '1' + '&headmaster_apply_status=' + '2' + '&audit_status=' + status
      console.log(url)
      window.$.jsonp(url, function () {
        try {
        } catch (e) {
        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
      this.layerShow_headermaster = false
      this.dealShow = false
    },
    chooseEduc: function (choice, item, status) {
      var token = functions.getParam('token')
      var AUDIT_URL = 'https://cloudappapi.test.xlhb.com/v1/record/audit-apply-record.api?access_token=' // 心理老师处理申请
      this.choice = choice
      var url
      if (this.layerShow_educ) {
        url = AUDIT_URL + token + '&record_id=' + item.record_id + '&org_id=' + item.org_id + '&role=' + '2' + '&educ_apply_status=' + item.educ_apply_status + '&audit_status=' + status
      }
      // url = AUDIT_URL + token + '&record_id=' + item.record_id + '&role=' + '1' + '&headmaster_apply_status=' + '2' + '&audit_status=' + status
      console.log(url)
      window.$.jsonp(url, function () {
        try {
        } catch (e) {
        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
      this.layerShow_educ = false
      this.dealShow = false
    },
    apply_audit: function (item, e) { // 班主任申请查看行为记录
      var token = functions.getParam('token')
      var APPLYSEE_URL = 'https://cloudappapi.test.xlhb.com/v1/record/apply-see-record.api?access_token=' // 班主任申请查看行为记录
      e.target.className = 'apply_yes'
      this.$invoke('showMessage', {message: '申请成功，请等待审核！'})
      var url = APPLYSEE_URL + token + '&record_id=' + item.record_id
      console.log(url)
      window.$.jsonp(url, function () {
        try {
        } catch (e) {
        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
    },
    prev: function (event) {
      if (this.$route.query.recordSign) { // recordSign为true时表示从首页进入记录详情页
        try {
          this.$invoke('toggleNavigation', { isShow: true })
          this.$invoke('setTitle', { title: '首页' })
        } catch (e) {
        }
      }
      this.$router.go(-1)
    }
  }
}

</script>
