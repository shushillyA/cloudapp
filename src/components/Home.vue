<template>
  <div class="wrap">
    <!--预警部分-->
    <section id="warn_wrap" v-if='warnShow'>
      <div class="warn">
        <div class='warn_main' v-if='role !== "EDUCATION_BOARD"'>
          <router-link :to="{ name: 'home_newwarn', params: { type: 'new'}}">
            <div class="new_warn clearfix">
              <div class="add_warn">
                <div class="new_number">{{new_number}}</div>
                <div class="new_text">新增预警</div>
              </div>
            </div>
          </router-link>
          <span class='line'></span>
          <router-link :to="{ name: 'home_sumwarn', params: { type: '30'}}">
            <div class="sum_warn">
              <div class="all_warn">
                <div class="sum_number">{{sum_number}}</div>
                <p class="sum_text">预警总数</p>
              </div>
            </div>
          </router-link>
        </div>
        <div class='warn_main' v-if='role === "EDUCATION_BOARD"'>
          <div @click='goMore()' class="new_warn clearfix">
            <div class="add_warn">
              <div class="new_number">{{behavior_number}}</div>
              <div class="new_text">行为预警</div>
            </div>
          </div>
          <span class='line'></span>
            <div class="sum_warn">
              <div class="all_warn">
                <div class="sum_number">{{evaluation_number}}</div>
                <p class="sum_text">测评预警</p>
              </div>
            </div>
        </div>
      </div>
    </section>
    <section id='warn_small_wrap' v-if='warnSmallShow'>
      <div class='warn_small'></div>
    </section>
    <section id='warn_other'>
      <!--学生行为预警-->
      <section id='behavior' class='shell' v-if='role==="EDUCATION_BOARD"'>
        <!--<h2>学生行为预警管理系统</h2>-->
        <!--<router-link :to="{name: 'sheetlist'}">-->
        <h2 @click='goMore()'>学生行为预警管理系统<span>more</span></h2>
        <!--</router-link>-->
        <div class='sheet_body'>
          <div id="main_behavior"></div>
        </div>
        <div class='change_day'>
          <span v-for='(item, $index) in [7, 15, "本月"]'  v-on:click='changeDay($index, "Behavior")' :class='i === $index?"selected":""' >{{$index === 2 ? item : (item + '天')}}</span>
        </div>
        <!--<div class='NoContent'>暂无内容</div>-->
      </section>
      <!--学生测评预警-->
      <section id='evaluation' class='shell' v-if='role==="EDUCATION_BOARD"'>
        <h2>心理测评预警管理系统</h2>
        <div class='sheet_body'>
          <div id="main_evaluation"></div>
        </div>
        <div class='change_day'>
          <span v-for='(item, $index) in [7, 15, "本月"]'  v-on:click='changeDay($index, "Evaluation")' :class='j === $index?"selected":""' >{{$index === 2 ? item : (item + '天')}}</span>
        </div>
        <!--<div class='NoContent'>暂无内容</div>-->
      </section>
       <!--我的记录部分-->
      <section id="my_msg" class='shell' v-if='recordShow'>
        <h2>
          <router-link :to="{ name: 'record'}">
          <p>我的记录</p>
          </router-link>
          <span id='msg_declare' v-on:click='dealLayer' v-if='dealShow && record_declare_status===1 && (start_at < currentTime < end_at) && (role==="CLASS_TEACHER" || role === "PSYCHOLOGY_TEACHER")'>申报入口</span>
          <span id='msg_add' v-on:click="addRecord">添加</span></h2>
        <ul class="my_msg_body">
          <p class='NoContent' v-show='msg_show'>暂无记录</p>
          <div class="deal" v-show="layerShow" transition='fade' @click="dealLayer">
            <div @click.stop="">
              <p class="choice">是否确认本周{{record_classname}}全体学生<br>暂无异常行为？
                <br>
                <span id='closedate'>（17:00截止申报）</span>
              </p>
              <span class='deny' @click='choose(1)'>取消</span>
              <span class='declare' @click='choose(2)'>申报</span>
            </div>
          </div>
              <li v-for="msg in messages" v-on:click='getDetail(msg)'>
                <div class="msg_single_detail">
                  <p class="msg_name">{{msg.realname}}</p>
                  <p class="msg_class">{{msg.classname}}</p>
                  <p class="msg_date">{{msg.created_home_time}}</p>
                </div>
                <p class="msg_content" v-if='msg.all_content_arr.length!==0'>{{msg.all_content_arr}}</p>
                <!--<p class="msg_content" v-if='msg.all_content.length!==0'>{{msg.all_content}}</p>-->
              </li>
        </ul>
      </section>
      <!--今日预约有内容部分-->
      <section class='shell' v-if='today_show1'>
        <h2 v-on:click='jumpToPage'>今日预约 <span>more</span></h2>
        <ul class="today_body">
          <li v-for='item in items'>
            <div class="item_name">{{item.name}}</div>
            <div class="item_class">{{item.class_name}}</div>
            <div class="order_time">
              <div class="clearfix">
                <img class='start_time' src="../assets/start_time.png">
                <span class="start_time_text">{{item.ap_time}}</span>
              </div>
              <div class="clearfix">
                <img class='end_time' src="../assets/end_time.png">
                <span class="end_time_text">{{item.end_time}}</span>
              </div>
            </div>
          </li>
        </ul>
      </section>
      <!--心理测评部分-->
      <section id='evaluation' class='shell' v-if='evaluationShow'>
        <router-link :to="{name: 'home_evaluation'}">
          <h2>心理测评<span>more</span></h2>
        </router-link>
        <div class='NoContent' v-if='evalContentShow'>暂无测评</div>
        <div class='evaluation_body' v-show='bodyShow'>
          <div class='body_circle'>
            <div id='circle'></div>
            <img v-if="progress > 9" v-bind:src='"../assets/" + Math.floor(progress / 10) + "0.png"'>
            <div class='main' v-show='evaluation_show'>
              <p>【{{ce_type}}】</p>
              <p>{{body_table}}</p>
            </div>
            <div class='finish'>
              <p class='finish_name'>已测</p>
              <p class='finish_number'>{{finish_number}}</p>
            </div>
            <div class='untreated' v-if='untreatedShow'>
              <p>未测</p>
              <p>{{untreated_number}}</p>
            </div>
          </div>
        </div>
      </section>
      <!--认知训练部分-->
      <section id='cognition' class='shell' v-if='cognitionShow'>
        <router-link :to="{name: 'cognition'}">
          <h2>认知训练 <span>more</span></h2>
        </router-link>
        <div class='cognition_body'>
          <div class='body_column'>
            <div class='body_person'>
              <div class='body_number'>
                <p>3</p>
                <p>2</p>
                <p>1</p>
                <p>0</p>
              </div>
              <div class='week_cognition' v-for='cognition_item in cognition_items'>
                <div></div>
              </div>
            </div>
            <div class='body_week'>
              <p>一</p>
              <p>二</p>
              <p>三</p>
              <p>四</p>
              <p>五</p>
              <p>六</p>
              <p>七</p>
              <p>八</p>
            </div>
          </div>
        </div>
      </section>
      <!--3D沙盘部分-->
      <section id='sand_table' class='shell' v-if='sandShow'>
        <router-link :to="{name: 'home_sandtable'}">
          <h2>3D沙盘 <span>more</span></h2>
        </router-link>
        <div class='sand_table_body'>
          <ul class='body_detail'>
            <li class='NoContent' v-show='sand_show'>暂无内容</li>
            <li class='body_single_detail' v-for='sand_item in sand_items'>
              <p class='sort'>{{sand_item.index}}</p>
              <p class='name'>{{sand_item.realname}}</p>
              <img v-if="sand_item.sex==='男'" src="../assets/female.png" class='female'>
              <img v-if="sand_item.sex==='女'" src="../assets/male.png" class='male'>
              <p class='age'>{{sand_item.age}}岁</p>
              <p class='exercise'>第{{sand_item.report_no}}次</p>
            </li>
          </ul>
        </div>
      </section>
      <!--倾诉系统部分-->
      <section id='talk_feelings' class='shell' v-if='talkShow'>
        <router-link :to="{name: 'home_talking'}">
          <h2>倾诉系统<span>more</span></h2>
        </router-link>
        <div class='talk_feelings_body'>
          <div class='talk_body_column'>
            <div class='talk_body_person'>
              <div class='talk_body_number'>
                <p>15</p>
                <p>10</p>
                <p>5</p>
                <p>0</p>
              </div>
              <div class='talk_week' v-for='talk_item in talk_items'>
                <div></div>
              </div>
            </div>
            <div class='talk_body_week'>
              <p>第1周</p>
              <p>第2周</p>
              <p>第3周</p>
              <p>第4周</p>
            </div>
          </div>
        </div>
      </section>
      <!--今日预约无内容部分-->
      <section class='shell' v-if='today_show2'>
        <h2 v-on:click='jumpToPage'>今日预约 <span>more</span></h2>
        <ul class="today_body">
          <li class='NoContent'>暂无预约</li>
        </ul>
      </section>
      <!--心秘密部分-->
      <section id='secret' class='shell' v-if='secretShow'>
        <router-link :to="{name: 'article'}">
          <h2>心理探秘 <span>more</span></h2>
        </router-link>
        <div class="secret_body">
          <section class='NoContent' v-show='secret_show'>暂无内容</section>
          <div v-for='secret in secrets'>
            <router-link :to="{name: 'articledetail', params: {article_id: secret.id}}">
              <section>
                <p class="secret_title">{{secret.title}}</p>
                <p class="secret_content">心理心语:{{secret.description}}</p>
              </section>
            </router-link>
          </div>
        </div>
      </section>
      <router-view name='a'></router-view>
    </section>
  </div>
</template>
<style lang='postcss' scoped>
  /*预警部分*/

  #warn_wrap {
    width: 100%;
    height: 20rem;
  }

  #warn_small_wrap {
    width: 100%;
    height: 10rem;
  }

  .warn_img {
    width: 100%;
    height: 20rem;
  }

  .warn {
    width: 100%;
    height: 20rem;
    color: #fff;
    margin: 0;
    padding: 0;
    background-image: url("../assets/warn.png");
    background-size: cover;
  }

  .warn_small {
    width: 100%;
    height: 10rem;
    margin: 0;
    padding: 0;
    background-image: url("../assets/warn_small.png");
    background-size: cover;
  }

  .warn_main {
    width: 100%;
    height: 10rem;
  }

  .add_warn,
  .all_warn {
    padding: 16%;
    text-align: center;
  }

  .line {
    float: left;
    width: 1px;
    height: 5rem;
    background-color: #fff;
    margin-top: 2.5rem;
  }

  .new_warn {
    float: left;
    width: 29%;
    height: 8rem;
    margin-top: 0.5rem;
    margin-left: 15.5%;
    margin-right: 5%;
  }

  .sum_warn {
    float: left;
    width: 29%;
    height: 8rem;
    margin-top: 0.5rem;
    margin-right: 15.5%;
    margin-left: 5%;
  }

  .new_number,
  .sum_number {
    font-size: 4rem;
    color: #ffffff;
    height: 4.5rem;
  }

  .new_text,
  .sum_text {
    font-size: 1.6rem;
    color: #ffffff;
  }

  section h2 {
    font-size: 2rem;
    color: #3dbfff;
    height: 4.4rem;
    line-height: 3.6rem;
    border-bottom: 1px solid #e6eaf0;
    margin-left: 0.6rem;
    margin-right: 0.6rem;
  }

  section span {
    float: right;
    font-size: 1.8rem;
    color: #b2b3c4;
  }
  /*学生行为预警管理系统*/
  #behavior, #evaluation{
    & .sheet_body{
      height: 21rem;
      margin-top:-2rem;
      & #main_behavior, & #main_evaluation{
        width: 100%;
        height:100%;
      }
    }
    & .change_day{
      width:100%;
      height:6rem;
      & span{
        width:20%;
        height:2.5rem;
        line-height:2.5rem;
        display:block;
        float:left;
        font-size:1.6rem;
        color:#a5a6bb;
        background-color: #eceef6;
        border-radius: 1.5rem;
        text-align:center;
        margin:2rem 0 1rem 10%;
      }
      & span.selected{
        color:#fff;
        background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#38b7ff), to(#01d4ff));
      }
    }
    
  }
  /*心理测评部分*/

  #warn_other {
    margin-top: -4rem;
    padding-bottom: 2rem;
  }

  .evaluation_body {
    width: 100%;
    height: 20rem;
  }

  .body_circle {
    width: 18rem;
    height: 18rem;
    margin: 3rem auto;
    padding: 3.6rem 0;
    text-align: center;
    position: relative;
  }

  .body_circle img {
    width: 18rem;
    height: 18rem;
    position: absolute;
    left: 0;
    top: 0;
  }

  #circle {
    border-radius: 8.75rem;
    height: 17.5rem;
    width: 17.5rem;
    left: 0.15rem;
    top: 0.15rem;
    position: absolute;
    border: 1px solid #e1e7f0
  }

  .main {
    margin-top: 0.6rem;
  }

  .main p:nth-child(1) {
    font-size: 1.6rem;
    color: #3dbfff;
  }

  .main p:nth-child(2) {
    font-size: 1.6rem;
    color: #a5a6bb;
    width: 80%;
    height: 2rem;
    margin: 0.6rem auto 0;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .finish {
    margin-top: 1.8rem;
  }

  .finish p:nth-child(1) {
    font-size: 1.5rem;
    color: #a5a6bb;
  }

  .finish p:nth-child(2) {
    font-size: 3rem;
    color: #515974;
  }

  .untreated {
    width: 4rem;
    height: 4rem;
    border-radius: 2rem;
    background-color: #e1e7f0;
    position: absolute;
    left: 0;
    top: 2rem;
  }

  .untreated p:nth-child(1) {
    color: #969da8;
    font-size: 1.2rem;
    margin-top: 0.6rem;
  }

  .untreated p:nth-child(2) {
    color: #969da8;
    font-size: 1.6rem;
  }
  /*认知训练部分*/

  .cognition_body {
    width: 100%;
    height: 20rem;
  }

  .body_column {
    padding: 2.6rem 2rem;
    text-align: center;
  }

  .body_person {
    width: 100%;
    height: 12rem;
    clear: both;
  }

  .body_number {
    float: left;
    width: 4%;
    height: 12rem;
  }

  .body_number p {
    font-size: 1.6rem;
    color: #c0c1cf;
    margin-bottom: 2.2rem;
  }

  .week_cognition {
    float: left;
    width: 3%;
    height: 100%;
    border-radius: 1rem;
    margin-left: 9%;
    position: relative;
  }

  .week_cognition div {
    width: 0.5rem;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#2ca7ec), to(#1cd7ff));
    border-radius: 1rem;
    position: absolute;
    bottom: 0;
  }

  .body_week {
    width: 100%;
    height: 2rem;
    padding-left: 7%;
    margin-top: 1rem;
  }

  .body_week p {
    width: 7.5%;
    float: left;
    font-size: 1.6rem;
    color: #c0c1cf;
    margin-left: 5%;
  }
  /*3d沙盘部分*/

  /*.sand_table_body {
    padding: 1.2rem 0;
  }*/

  .body_detail {
    width: 96%;
    padding-top:0.5rem;
    margin: 0 2%；
  }

  .body_single_detail {
    width: 100%;
    height: 4rem;
    line-height: 4rem;
    margin: 1rem 0rem;
  }

  .sort {
    float: left;
    width: 2.8rem;
    height: 2.8rem;
    line-height: 2.8rem;
    text-align: center;
    color: #fff;
    font-size: 1.6rem;
    background-size: cover;
    background-image: url('../assets/circle.png');
    margin-top: 0.6rem;
    margin-right: 2%;
  }

  .name {
    width: 26%;
    float: left;
    font-size: 1.8rem;
    color: #515974;
    text-align: center;
  }

  .male {
    height: 1.8rem;
    float: left;
    margin: 1.1rem 2% 0rem 2%;
  }

  .female {
    height: 1.4rem;
    float: left;
    margin: 1.2rem 1.5% 0rem 1.5%;
  }

  .age {
    width: 16%;
    float: left;
    font-size: 1.8rem;
    color: #c2c3d8;
    text-align: center;
  }

  .exercise {
    width: 32%;
    float: right;
    font-size: 1.6rem;
    color: #c2c3d8;
    text-align: right;
  }
  /*倾诉系统部分*/

  .talk_body_column {
    padding: 2.6rem 2rem;
    text-align: center;
  }

  .talk_body_person {
    width: 100%;
    height: 12rem;
    clear: both;
  }

  .talk_body_number {
    float: left;
    width: 8%;
    height: 12rem;
  }

  .talk_body_number p {
    font-size: 1.6rem;
    color: #c0c1cf;
    margin-bottom: 2.2rem;
  }

  .talk_week {
    float: left;
    width: 6%;
    height: 100%;
    border-radius: 1rem;
    margin-left: 16%;
    position: relative;
  }

  .talk_week div {
    width: 0.5rem;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#2ca7ec), to(#1cd7ff));
    border-radius: 0.4rem;
    position: absolute;
    bottom: 0;
  }

  .talk_body_week {
    width: 100%;
    height: 2rem;
    margin-top: 1rem;
    margin-left: 10%;
  }

  .talk_body_week p {
    width: 20%;
    float: left;
    font-size: 1.6rem;
    color: #c0c1cf;
    margin-left: 3%;
  }
  /*今日预约部分*/

  .NoContent {
    text-align: center;
    font-size: 1.7rem;
    color: #c2c3d8;
    line-height: 4rem;
    margin-top:0.6rem !important;
    margin-bottom:0rem !important;
  }

  .today_body li {
    overflow: hidden;
    height:6rem;
    line-height:6rem;
  }

  .order_time {
    float: right;
    height:6rem;
    line-height:6rem;
    padding-top:0.8rem;
  }
  .order_time div{
    height: 2rem;
    line-height: 2rem;
  }
  .order_time div:nth-child(1){
    margin-bottom:1rem;
  }
  .item_name {
    float: left;
    width: 24%;
    font-size: 1.8rem;
    color: #515974;
    text-align: left;
    overflow: hidden;
  }

  .item_class {
    float: left;
    width: 25%;
    font-size: 1.8rem;
    color: #c2c3d8;
    margin-left: 5%;
    overflow: hidden;
  }

  .start_time {
    float: left;
    width: 22px;
    height: 22px;
    text-align: left;
    margin-right: 0.4rem;
  }

  .start_time_text {
    float: left;
    font-size: 2.2rem;
    color: #3dbfff;
  }

  .end_time {
    float: left;
    width: 22px;
    height: 22px;
    margin-right: 0.4rem;
  }

  .end_time_text {
    float: left;
    font-size: 2.2rem;
    color: #c2c3d8;
  }
  /*我的记录部分*/

  .shell {
    overflow: inherit;
  }

  #my_msg {
    position: relative;
  }
  .my_msg_body li{
    margin:1rem;
  }
  #my_msg h2 p:nth-child(1) {
    font-size: 2rem;
    color: #3dbfff;
    height: 4.4rem;
    line-height: 3.6rem;
    border-bottom: 1px solid #e6eaf0;
    margin-left: 0.6rem;
    margin-right: 0.6rem;
    float: left;
  }

  #my_msg h2 p:nth-child(2) {
    width: 17rem;
    font-size: 1.6rem;
    color: #fff;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ffe679), to(#ffba5b));
    height: 4rem;
    line-height: 4rem;
    float: left;
    text-align: center;
    border-radius: 7px;
    position: absolute;
    top: -2.5rem;
    left: 7rem;
    z-index: 99999;
  }

  #my_msg h2 p:nth-child(2) span {
    width: 2rem;
    height: 2rem;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ffcd68), to(#ffba5b));
    transform: rotate(45deg);
    position: absolute;
    left: 2rem;
    top: 2.1rem;
    z-index: -1;
  }

  #msg_declare {
    display: inline-block;
    padding:0 1rem;
    height: 2.6rem;
    line-height: 2.6rem;
    text-align: center;
    border-radius: 1.3rem;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ff435f), to(#fe4e84));
    float: left;
    font-size: 1.5rem;
    color: #fff;
    margin-top: 0.5rem;
    box-shadow: 0 0 1rem #fff3d6;
    margin-left: 18%;
  }

  #msg_add {
    display: inline-block;
    width: 4.8rem;
    height: 2.6rem;
    line-height: 2.6rem;
    text-align: center;
    border-radius: 1.3rem;
    background-color: #36c4fa;
    float: right;
    font-size: 1.5rem;
    color: #fff;
    margin-top: 0.5rem;
    box-shadow: 0 0 1rem #56dcf9;
  }


  .msg_single_detail {
    width: 100%;
    height: 2.6rem;
    line-height: 2.6rem;
    overflow: hidden;
  }

  .msg_name {
    width: 30%;
    font-size: 1.7rem;
    color: #515974;
    text-align: left;
    float: left;
    overflow: hidden;
    margin-right: 1rem;
  }

  .msg_class {
    width: 34%;
    font-size: 1.6rem;
    color: #c2c3d8;
    float: left;
  }

  .msg_date {
    width: 30.33%;
    float: right;
    font-size: 1.6rem;
    color: #c2c3d8;
    text-align: right;
  }

  .msg_content {
    height: 2.6rem;
    line-height: 2.6rem;
    font-size: 1.7rem;
    color: #c2c3d8;
    overflow: hidden;
    overflow-text: ellipse
  }
  /*弹出层*/

  .deal {
    z-index: 1;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
  }

  .deal div {
    width: 70%;
    height: 14rem;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 150%);
    border-radius: 6px;
  }

  .choice {
    font-size: 1.6rem;
    color: #626370;
    width: 100%;
    height: 10rem;
    line-height: 2.3rem;
    text-align: center;
    border-bottom: 1px solid #dfdfdf;
    padding: 1.7rem;
  }

  #closedate {
    color: #3dbfff;
    font-size: 1.6rem;
    width: 100%;
    text-align: center;
    line-height: 2.3rem;
  }

  .deny,
  .declare {
    height: 4rem;
    line-height: 4rem;
    width: 50%;
    color: #3dbfff;
    font-size: 1.6rem;
    display: inline-block;
    float: left;
    text-align: center;
  }

  .deny {
    border-right: 1px solid #dfdfdf;
  }
  /*心秘密部分*/

  .secret_body div {
    margin: 1.5rem 0 1.6rem 0;
  }

  .secret_body div p:nth-child(1) {
    font-size: 1.8rem;
    color: #515974;
    height: 2.6rem;
    line-height: 2.6rem;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    /*text-overflow: ellipsis;*/
  }

  .secret_body div p:nth-child(2) {
    font-size: 1.7rem;
    color: #c2c3d8;
    height: 2.6rem;
    line-height: 2.6rem;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    /*text-overflow: ellipsis;*/
  }
</style>
<script>
  import functions from '../functions'
  import echarts from 'echarts'
  // var token = functions.getParam('token')
  // var role = functions.getParam('role')
  // var HOMEPAGE_URL = 'https://cloudappapi.test.xlhb.com/v1/homepage.api?access_token='
  // var HOMEPAGE_URL_EDU = 'https://cloudappapi.test.xlhb.com/v1/edu-homepage.api?access_token='
  export default {
    name: 'home',
    beforeCreate () {
    },
    created () {
      console.log(this.$data, '数据')
      // 第一次进入需要请求后台判断
      // 如果返回就不需要请求了 直接调用vuex
      // if (this.$store.state.noWlAN.index === '') {
      // }
      if (functions.getParam('role') === 'EDUCATION_BOARD') { //  教育局
        this.warnShow = true   // 让头默认显示
        this.renderEduData()
      } else {
        this.warnShow = false    // 让头默认消失
        this.renderData()
      }
      functions.getLoadTime()
      // 渲染数据
      this.currentTime = (new Date()).valueOf()
      // this.renderData(HOMEPAGE_URL)
      this.getPeriod() // 获取申报的period_id
      this.code = functions.getParam('role')
      console.log(this.code, '角色')
      // this.renderData(HOMEPAGE_URL)
      // console.log(role, '角色')
    },
    data () {
      return {
        new_number: '',
        sum_number: '',
        evaluation_show: true,
        evalContentShow: false,
        bodyShow: true,
        body_table: '',
        ce_type: '',
        finish_number: '',
        untreated_number: '',
        progress: '',
        untreatedShow: true,
        today_show1: false,
        today_show2: false,
        msg_show: false,
        sand_show: false,
        secret_show: false,
        items: [],
        messages: [],
        cognition_items: [],
        talk_items: [],
        sand_items: [],
        secrets: [],
        sex_class: '',
        warnShow: true,    // 教育局 心理老师的头部
        warnSmallShow: false,   // 其他的头部
        evaluationShow: false,
        talkShow: false,
        cognitionShow: false,
        sandShow: false,
        recordShow: false,
        record_declare_status: '',
        layerShow: false,
        dealShow: true,
        secretShow: false,
        // role: role,
        role: functions.getParam('role'),
        record_classname: '',
        currentTime: '',
        class_id: '',
        period_id: '', // 老师申报传的参数,起止时间
        start_at: '',
        end_at: '',
        committed_at: '', // 是否申报  > 0申报了
        code: '',
        recordNoWarning: '', // 记录是否有预警  无预警申报,
        behaviorChart: '',
        evaluationChart: '',
        i: 0, // 默认选中第一个
        j: 0,
        behavior_number: '',
        evaluation_number: '',
        buttonFlag: 0,
        buttonFlag1: 0
      }
    },
    mounted () {
      try {
        window.$.invoke('showButton', { text: '@scan' })
      } catch (e) {

      }
      // this.getChart()
    },
    methods: {
      addRecord: function () {
        window.localStorage.removeItem('recordParams')
        this.$router.push('/record/add/')
        this.$router.go(1)
      },
      renderDataFun: function (obj) {
        var self = this
        var maxStr = 15
        // window.$.invoke('showMessage', { code: obj.code, message: obj.msg })
        self.code = obj.code
        var results = obj.data
        console.log(obj, 'obj')
        console.log(obj.data, 'obj.data')
        self.role = results.user_info.role // 登录角色
        console.log(results.user_info.role)
        self.$store.state.role = results.user_info.role
        self.record_classname = results.user_info.full_name // 班主任申报时的班级
        self.class_id = results.user_info.class_id // 班主任申报时的班级id
        try {
          if (results.warning_new_num && results.warning_total_num) {
            self.warnShow = true
            self.warnSmallShow = false
            self.new_number = results.warning_new_num
            self.sum_number = results.warning_total_num
          } else {
            self.warnShow = false
            self.warnSmallShow = true
          }

          // 心理测评部分
          if (results.activity_data) {
            self.evaluationShow = true
            if (results.activity_data.length === 0) {
              self.evalContentShow = true
              self.bodyShow = false
            } else {
              self.bodyShow = true
              if (results.activity_data.progress === 100) {
                self.untreatedShow = false
              } else {
                self.untreatedShow = true
              }
              if (parseInt(results.activity_data.ce_type) === 1) {
                self.ce_type = '个测'
              } else if (parseInt(results.activity_data.ce_type) === 0) {
                self.ce_type = '普测'
              }
              if (results.activity_data.activity_scale.length > 10) {
                results.activity_data.activity_scale = results.activity_data.activity_scale.substr(0, 10) + '...'
              }
              self.body_table = results.activity_data.title
              // 已测与未测的数据
              if (results.activity_data.progress_data[1] !== 0) {
                self.finish_number = results.activity_data.progress_data[1].split('/')[0]
                self.untreated_number = results.activity_data.progress_data[1].split('/')[1] - self.finish_number
              } else if (results.activity_data.progress_data[1] === 0) {
                self.finish_number = 0
                self.untreated_number = 0
              }
              if (self.finish_number === 0 && self.untreated_number === 0) {
                // self.evaluation_show = false
              }
              // 圆的进度
              self.progress = results.activity_data.progress
            }
          } else {
            self.evaluationShow = false
          }
          // 认知系统部分
          if (results.cognize_data) {
            self.cognitionShow = true
            if (Array.isArray(results.cognize_data)) {
              if (results.cognize_data.length === 0) {
                results.cognize_data = [100, 67, 83, 73, 50, 83, 67, 73]
                self.cognition_items = results.cognize_data
              } else {
                self.cognition_items = results.cognize_data // 认知系统的柱状图
              }
              self.$nextTick(function () {
                var showcognition = document.querySelectorAll('.week_cognition div')
                for (var k = 0; k < showcognition.length; k++) {
                  showcognition[k].style.height = results.cognize_data[k] + '%'
                }
              })
            }
          } else {
            self.cognitionShow = false
          }
          // 3D沙盘部分
          if (results.sand_data) {
            self.sandShow = true
            if (Array.isArray(results.sand_data)) {
              if (results.sand_data.length > 0) {
                self.sand_show = false
                for (var m = 0; m < results.sand_data.length; m++) {
                  var sandObj = results.sand_data[m]
                  sandObj['index'] = m + 1
                  self.sand_items.push(sandObj)
                }
              } else if (results.sand_data.length === 0) {
                self.sand_show = true
              }
            }
          } else {
            self.sandShow = false
          }

          // 倾诉系统部分
          if (results.oauth_data) {
            self.talkShow = true
            if (Array.isArray(results.oauth_data)) {
              if (results.oauth_data.length > 0) {
                self.talk_items = results.oauth_data[1] // 倾诉系统的柱状图
                self.$nextTick(function () { // vue中获取v-for中的dom元素
                  var showtalk = document.querySelectorAll('.talk_week div')
                  console.log(showtalk)
                  for (var k = 0; k < showtalk.length; k++) {
                    showtalk[k].style.height = results.oauth_data[1][k] + '%'
                  }
                })
              } else if (results.oauth_data.length === 0) {
                self.talk_items = [87, 75, 47, 100]
                self.$nextTick(function () { // vue中获取v-for中的dom元素
                  var showtalk = document.querySelectorAll('.talk_week div')
                  console.log(showtalk)
                  for (var k = 0; k < showtalk.length; k++) {
                    showtalk[k].style.height = self.talk_items[k] + '%'
                  }
                })
              }
            }
          } else {
            self.talkShow = false
          }
          // 今日预约部分
          if (results.appoint_data && Array.isArray(results.appoint_data)) {
            if (results.appoint_data.length === 0) {
              self.today_show1 = false
              self.today_show2 = true
            } else {
              self.today_show1 = true
              self.today_show2 = false
              for (var j = 0; j < results.appoint_data.length; j++) {
                var stuObj = results.appoint_data[j]
                if (stuObj.class_name === '') {
                  stuObj.class_name = '--'
                } else {
                  stuObj.class_name = stuObj.class_name
                }
                // 时间戳的转换
                results['appoint_data'][j]['end_time'] = functions.getLocalTime(parseInt(stuObj.ap_time) * 1000 + 3600000).substr(11, 5)
                stuObj.ap_time = functions.getLocalTime(parseInt(stuObj.ap_time * 1000)).substr(11, 5)
                self.items.push(stuObj)
              }
            }
          } else {
            self.today_show2 = false
          }
          // 记录部分
          if (results.record_data) {
            self.recordShow = true
            if (self.role === 'PSYCHOLOGY_TEACHER' || 'CLASS_TEACHER') { // 班主任和心理老师申报  1是需要申报  0是不需要申报
              self.record_declare_status = results.record_declare_status
            }
            if (Array.isArray(results.record_data)) {
              if (results.record_data.length === 0) {
                self.msg_show = true
              } else {
                self.msg_show = false
                // 超過15個字符显示。。。
                for (var i = 0; i < results.record_data.length; i++) {
                  var recordObj = results.record_data[i]
                  recordObj['created_home_time'] = recordObj.created_time.substr(5, 5)
                  // if (recordObj.all_content.length > maxStr) {
                  //   recordObj.all_content = recordObj.all_content.substr(0, 19) + '...'
                  // }
                  var arr = []
                  for (var key in recordObj.all_content_arr) {
                    if (recordObj.all_content_arr[key].length > 0) {
                      arr.push(recordObj.all_content_arr[key])
                    }
                  }
                  recordObj.all_content_arr = arr.join(',')
                  if (recordObj.all_content_arr.length > maxStr) {
                    recordObj.all_content_arr = recordObj.all_content_arr.replace(/<\s?br[^>]*>/gi, '').substr(0, 19) + '...'
                  }
                  self.messages.push(recordObj)
                }
                console.log(self.messages)
              }
            }
          } else {
            self.recordShow = false
          }
          // 心理探秘模块
          if (results.scout_data) {
            self.secretShow = true
            if (Array.isArray(results.scout_data)) {
              if (results.scout_data.length > 0) {
                self.secret_show = false
                for (var s = 0; s < results.scout_data.length; s++) {
                  if (results.scout_data[s].title.length > 15) {
                    results.scout_data[s].title = results.scout_data[s].title.substr(0, 15) + '...'
                  }
                  if (results.scout_data[s].description.length > 18) {
                    results.scout_data[s].description = results.scout_data[s].description.substr(0, 14) + '...'
                  }
                  self.secrets.push(results.scout_data[s])
                }
              } else {
                self.secret_show = true
              }
            }
          } else {
            self.secretShow = false
          }
        } catch (e) {
          window.$.invoke('showMessage', {message: '请求超时，请重新加载'})
        }
      },
      // 心理老师，家长，班主任渲染数据
      renderData: function () {
        var self = this
        // var maxStr = 15
        var url = 'https://cloudappapi.test.xlhb.com/v1/homepage.api?access_token='
        var token = functions.getParam('token')
        url = url + token
        console.log(url)
        window.$.jsonp(url, function (obj) {
          console.log(obj, '数据')
          // 回调函数
          if (obj) {   // 如果有收到obj
            // 保存到vuex
            self.$store.state.noWLAN.home.data = obj
            console.log(self.$store.state.noWLAN.home.data, 'vuex的数据')
            self.renderDataFun(obj)   // 传入对象
          } else {
            window.$.invoke('showMessage', {message: '请求超时，请重新加载'})
          }
        }, function () {
          console.log('网络不好')
          window.$.invoke('showMessage', { message: '网络请求失败' })
        })
      },
      // 教育局渲染数据
      renderEduDataFun: function (obj) {
        var self = this
        console.log(obj, '收到的数据打印')
        self.warnShow = true
        self.warnSmallShow = false
        self.behavior_number = obj.data.records_records
        self.evaluation_number = obj.data.ceping_records
        // self.behavior_number = 0
        // self.evaluation_number = 0
        self.behaviorChart = obj.data.behavior
        self.evaluationChart = obj.data.ceping
        console.log(obj.data.behavior)
        self.renderBehaviorData(0)
        self.renderEvaluationData(0)
      },
      renderEduData: function () {
        var url = 'https://cloudappapi.test.xlhb.com/v1/edu-homepage.api?access_token='
        var token = functions.getParam('token')
        url = url + token
        console.log(url, '地址')
        var self = this
        console.log('渲染数据')
        if (this.$store.state.noWLAN.index === 'behavior') {    // 如果是后退来的  不用请求jsonp
          console.log('我是返回来的')
          this.$store.state.noWLAN.index = ''    // 清空
          this.$nextTick(function () {
            self.renderEduDataFun(self.$store.state.noWLAN.home.data)
          })
        } else {    // 第一次进来
          window.$.jsonp(url, function (obj) {
            console.log(obj, '数据数据')
            if (obj) {  // 如果收到了数据
              self.$store.state.noWLAN.home.data = obj   // 保存数据
              console.log(self.$store.state.noWLAN.home.data, 'vuex的数据')
              self.renderEduDataFun(obj)
            }
          }, function () {  // 第一次进入网络不好
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
        }
      },
      renderXYData: function (index, behaviorChart) {
        let now = new Date()
        // 6月份
        // now.setTime(now.getTime() - 86400 * 1000 * 31)
        let timestamp = now.getTime()
        let start
        let end

        switch (index) {
          case 0:
            start = new Date(timestamp - 6 * 86400 * 1000)
            end = now
            break
          case 1:
            start = new Date(timestamp - 14 * 86400 * 1000)
            end = now
            break
          case 2:
            start = new Date(now.getFullYear(), now.getMonth(), 1)
            end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
            end.setTime(end.getTime() - 86400 * 1000)
        }

        let xAxisData = []
        let yAxisData = []
        let first = true
        for (let i = start; i.getTime() <= end.getTime(); i.setTime(i.getTime() + 86400 * 1000)) {
          xAxisData.push((first ? i.getMonth() + 1 + '-' : '') + i.getDate())
          let dateString = i.getMonth() + 1 + '-' + i.getDate() + ''
          yAxisData.push(typeof behaviorChart[dateString] !== 'undefined' ? behaviorChart[dateString] : 0)
          first = false
        }
        return {xAxisData: xAxisData, yAxisData: yAxisData}
      },
      renderBehaviorData: function (index) {
        // var dataBehaviorList = []
        // var dayList = []
        // var month = new Date().getMonth() + 1
        console.log(this.behaviorChart, '收到的数据')
        var xyArr = this.renderXYData(index, this.behaviorChart)
        var xAxisData = xyArr.xAxisData
        var yAxisData = xyArr.yAxisData
        // let now = new Date()
        // now.setTime(now.getTime() - 86400 * 1000 * 31)
        // let timestamp = now.getTime()
        // let start
        // let end

        // switch (index) {
        //   case 0:
        //     start = new Date(timestamp - 6 * 86400 * 1000)
        //     end = now
        //     break
        //   case 1:
        //     start = new Date(timestamp - 14 * 86400 * 1000)
        //     end = now
        //     break
        //   case 2:
        //     start = new Date(now.getFullYear(), now.getMonth(), 1)
        //     end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        //     end.setTime(end.getTime() - 86400 * 1000)
        // }

        // let xAxisData = []
        // let yAxisData = []
        // let first = true
        // for (let i = start; i.getTime() <= end.getTime(); i.setTime(i.getTime() + 86400 * 1000)) {
        //   xAxisData.push((first ? i.getMonth() + 1 + '-' : '') + i.getDate())
        //   let dateString = i.getMonth() + 1 + '-' + i.getDate() + ''
        //   yAxisData.push(typeof this.behaviorChart[dateString] !== 'undefined' ? this.behaviorChart[dateString] : 0)
        //   first = false
        // }

        console.log('x轴', xAxisData)
        console.log('y轴', yAxisData)

        // for (var k in this.behaviorChart) {
        //   // if (index === 0 && parseInt(k) <= 7) { // 7天默认
        //     // dataBehaviorList.push(this.behaviorChart[k])
        //     // dayList.push(month + '-' + k)
        //   // } else if (index === 1 && parseInt(k) <= 15) { // 15天
        //     // dataBehaviorList.push(this.behaviorChart[k])
        //     // dayList.push(month + '-' + k)
        //   // } else if (index === 2 && parseInt(k) < 30) { // 30天
        //   dataBehaviorList.push(this.behaviorChart[k])    // y坐标
        //   // dayList.push(month + '-' + k)    // x坐标
        //   dayList.push(k)    // x坐标
        //   // }
        // }
        // console.log(dataBehaviorList, 'y轴')
        // console.log(dayList, 'x轴')
        // var dateNow = ''
        // if (new Date().getMonth() + 1 < 10) {
        //   dateNow = '0' + (new Date().getMonth()) + '-' + new Date().getDate()
        //   // dateNow = '0' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        // } else {
        //   dateNow = new Date().getMonth() + '-' + new Date().getDate()
        //   // dateNow = new Date().getMonth() + 1 + '-' + new Date().getDate()
        // }
        // var arr1 = []
        // var arr3 = []
        // var m = 0
        // for (var i = 0; i < dayList.length; i++) {
        //   if (dayList[i] === dateNow) {
        //     dateNow = i + 1
        //   }
        // }
        // if (index === 1) {   // 15天
        //   for (m = dateNow - 15; m < dateNow; m = m + 1) {
        //     arr1[arr1.length] = dayList[m]
        //     arr3[arr3.length] = dataBehaviorList[m]
        //   }
        //   dayList = arr1
        //   dataBehaviorList = arr3
        // } else if (index === 0) {  // 7天
        //   for (m = dateNow - 7; m < dateNow; m = m + 1) {
        //     arr1[arr1.length] = dayList[m]
        //     arr3[arr3.length] = dataBehaviorList[m]
        //   }
        //   dayList = arr1
        //   dataBehaviorList = arr3
        // } else if (index === 2) {
        //   var month11 = new Date().getMonth() < 10 ? '0' + (new Date().getMonth()) : '' + (new Date().getMonth())
        //   // 将上个月的删除做的循环
        //   for (let j = 0; j < dayList.length; j++) {
        //     console.log(dayList[j].indexOf(month11), '索引')
        //     if (dayList[j].indexOf(month11) !== -1) {   // 将上个月的删除
        //       console.log('进')
        //       arr1[arr1.length] = dayList[j]
        //       arr3[arr3.length] = dataBehaviorList[j]
        //     }
        //   }
        //   dayList = arr1
        //   dataBehaviorList = arr3
        //   var width = document.body.clientWidth
        //   console.log(width, '设备宽度')
        //   if (width <= 320) {
        //     // dayList.splice(dayList.length - 1, 0, 0)
        //     // dataBehaviorList.splice(dataBehaviorList.length - 1, 0, 0)
        //   } else if (width <= 375) {
        //     dayList.splice(dayList.length - 1, 0, 0)
        //     dataBehaviorList.splice(dataBehaviorList.length - 1, 0, 0)
        //   } else if (width <= 414) {
        //     // console.log(dayList[dayList.length - 1])
        //     dayList.splice(dayList.length - 1, 0, 0)
        //     dayList.splice(dayList.length, 0, 0)
        //     dataBehaviorList.splice(dataBehaviorList.length - 1, 0, 0)
        //     dataBehaviorList.splice(dataBehaviorList.length, 0, 0)
        //   }
        // }
        // // } else if (index === 2) {
        // //   console.log(dateNow, '11111')
        // //   for (m = 2; m <= 14; m = m + 2) {
        // //     arr1[arr1.length] = dayList[m]
        // //     console.log(m, 'm的值')
        // //   }
        // //   dayList = arr1
        // // }
        // console.log(dayList[0])
        // var index1 = new Date().getMonth() < 10 ? '0' + (new Date().getMonth() + 1) : '' + (new Date().getMonth() + 1)
        // var index2 = dayList[0].substr(0, 2)
        // console.log(index2, 'index2')
        // console.log(index1, 'index1')
        // for (let i = 1; i < dayList.length; i++) {
        //   if (dayList[i] === index1 + '-1' || dayList[i] === 0) {
        //     continue
        //   }
        //   dayList[i] = dayList[i].substr(3)
        //   // console.log(dayList[i], '每一项', typeof (dayList[i]))
        // }
        // console.log(dayList, '表一X')
        // console.log(dataBehaviorList, '表一Y')
        var myChart1 = echarts.init(document.getElementById('main_behavior'))
        var option1 = {
          // tooltip: {
          //   trigger: 'axis'
          // },
          grid: {
            left: '0%',
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            show: false, // 去除到处图表的图标
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            // offset: -10,
            nameLocation: 'start',
            gridIndex: 0,
            // inverse: true, // 反向
            // min: 3,
            // max: 31,
            scale: true,
            type: 'category',
            boundaryGap: false,
            // data: ['4-28', '4-29', '4-30', '5-1', '5-2', '5-3'],
            data: xAxisData,
            axisLine: { // 坐标轴和文字
              lineStyle: {
                color: '#d1d2dc'
              }
            },
            nameTextStyle: {
              fontSize: 0
            },
            axisLabel: {
              textStyle: {
                color: '#949494'
                // fontSize: 11
              },
              showMinLabel: true,
              showMaxLabel: true
            },
            axisTick: {  // 去掉刻度
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            // max: 40,
            // min: 0,
            splitNumber: 4,
            axisLine: { // 坐标轴和文字
              lineStyle: {
                color: '#d1d2dc'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#d1d2dc',
                fontSize: 12
              }
            },
            axisTick: {  // 去掉刻度
              show: false
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '',
              type: 'line',
              stack: '',
              symbol: 'none',
              // smooth: true, // 这句就是让曲线变平滑的
              // symbolSize: 12, // 控制折线点的大小
              // data: [0, 30, 35, 5, 0, 25, 29, 22],
              data: yAxisData,
              itemStyle: {
                normal: {
                  color: '#fea8b9'
                }
              }
            }
          ]
        }
        myChart1.setOption(option1)
      },
      renderEvaluationData: function (index) {
        console.log(this.behaviorChart, '收到的数据')
        var xyArr = this.renderXYData(index, this.evaluationChart)
        var xAxisData = xyArr.xAxisData
        var yAxisData = xyArr.yAxisData
        console.log('x轴', xAxisData)
        console.log('y轴', yAxisData)

        var myChart2 = echarts.init(document.getElementById('main_evaluation'))
        var option2 = {
          // tooltip: {
          //   trigger: 'axis'
          // },
          grid: {
            left: '0%',
            right: '5%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            show: false, // 去除到处图表的图标
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            // offset: -10,
            nameLocation: 'start',
            gridIndex: 0,
            // inverse: true, // 反向
            // min: 3,
            // max: 31,
            scale: true,
            type: 'category',
            boundaryGap: false,
            // data: ['4-28', '4-29', '4-30', '5-1', '5-2', '5-3'],
            data: xAxisData,
            axisLine: { // 坐标轴和文字
              lineStyle: {
                color: '#d1d2dc'
              }
            },
            nameTextStyle: {
              fontSize: 0
            },
            axisLabel: {
              textStyle: {
                color: '#949494'
                // fontSize: 11
              },
              showMinLabel: true,
              showMaxLabel: true
            },
            axisTick: {  // 去掉刻度
              show: false
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            // max: 40,
            // min: 0,
            splitNumber: 4,
            axisLine: { // 坐标轴和文字
              lineStyle: {
                color: '#d1d2dc'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#d1d2dc',
                fontSize: 12
              }
            },
            axisTick: {  // 去掉刻度
              show: false
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '',
              type: 'line',
              stack: '',
              symbol: 'none',
              // smooth: true, // 这句就是让曲线变平滑的
              // symbolSize: 12, // 控制折线点的大小
              // data: [0, 30, 35, 5, 0, 25, 29, 22],
              data: yAxisData,
              itemStyle: {
                normal: {
                  color: '#fea8b9'
                }
              }
            }
          ]
        }
        myChart2.setOption(option2)
      },
      dealLayer: function () {
        this.layerShow = true
      },
      getPeriod: function () {
        var token = functions.getParam('token')
        var url = 'https://cloudappapi.test.xlhb.com/v1/homepage/declare-period.api?access_token=' + token
        var self = this
        window.$.jsonp(url, function (obj) {
          console.log(url)
          try {
            self.period_id = obj.data.id
            self.start_at = obj.data.start_at * 1000
            self.end_at = obj.data.end_at * 1000
            console.log(self.period_id)
          } catch (e) {
          }
        }, function () {
          window.$.invoke('showMessage', { message: '网络请求失败' })
        })
      },
      choose: function (sign) { // 班主任和心理老师的申报
        this.layerShow = false
        this.dealShow = false
        if (sign === 1) {
          this.layerShow = false
          this.dealShow = true
        } else if (sign === 2) {
          this.layerShow = false
          this.dealShow = false
          if (this.role === 'CLASS_TEACHER' || this.role === 'PSYCHOLOGY_TEACHER') {
            var token = functions.getParam('token')
            var DECLARE_URL = 'https://cloudappapi.test.xlhb.com/v1/homepage/declare-push.api?access_token=' + token + '&period_id=' + this.period_id
          }
          console.log(DECLARE_URL)
          window.$.jsonp(DECLARE_URL, function () {
            try {
              window.$.invoke('showMessage', { message: '申报成功' })
            } catch (e) {
            }
          }, function () {
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
        }
      },
      getDetail: function (item) {
        var studentTemp = []
        console.log(item)
        studentTemp.push(item)
        console.log(studentTemp)
        this.$router.push({path: '/record/detail/', query: {items: studentTemp, recordSign: true}})
        this.$router.go(1)
        // this.$router.push({path: '/home/record/'})
        // this.$router.go(1)
      },
      goMore: function () {
        // router-link :to="{name: 'sheetlist'}"
        this.$http.jsonp('https://apicloud.xlhb.com/v1/user/user-info.api', {params: {access_token: functions.getParam('token')}}).then(
          function (obj) {
            // console.log(obj, 'getUserInfo')
            obj = obj.data
            // console.log(obj.data.data.role)
            // this.$store.state.role = obj.data.data.role
            // console.log('判断市，区教育局')
            if (obj.data.province_name !== '' && obj.data.city_name !== '' && obj.data.area_name !== '') { // 省市都不为空为市  省市区都不为空为区
              this.$store.state.behavior.isArea = true // 表示是区
              // this.isArea = true  // 表示是区
            }
            this.$router.push({path: '/behavior/'})
          }, function () {
          window.$.invoke('showMessage', { message: '网络请求失败' })
        })
      },
      changeDay: function (index, type) {
        console.log(this.i)
        if (type === 'Behavior') {
          if (this.buttonFlag === index) {
            return
          }
          this.i = index
          this.buttonFlag = index
          this.renderBehaviorData(index)
        } else if (type === 'Evaluation') {
          if (this.buttonFlag1 === index) {
            return
          }
          this.buttonFlag1 = index
          this.j = index
          this.renderEvaluationData(index)
        }
      },
      jumpToPage: function () {
        try {
          window.$.invoke('jumpToPage', { name: '我的预约', data: {} })
        } catch (e) {

        }
      }
    }
  }
</script>
