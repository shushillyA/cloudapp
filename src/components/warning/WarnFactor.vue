<template>
  <div class="wrap">
    <div class="warn">
      <div class='top'></div>
      <div id='content'>
        <section class="shell" v-for='item in items'>
          <div class="warn_title" v-on:click="clickShownT(item.index)">
            <img class='warnImg' v-if='item.warning_level==="3"' src='../../assets/warnSign.png'>
            <img class='warnImg' v-if='item.warning_level==="2"' src='../../assets/warnSign3.png'>
            <img class='warnImg' v-if='item.warning_level==="1"' src='../../assets/warnSign2.png'>
            <div class="warn_div">{{item.factor_name}}</div>
            <img class='row_img' src='../../assets/row.png' alt=""  :style="item.show?'transform:rotate(90deg)':''">
          </div>
          <div class="warn_body" v-if="item.show" >
            <div>{{item.warning_intro}}</div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .warn{
    & .top{
      width:100%;
      height:5rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
    & #content {
      margin-top:-3rem;
      & .warn_title{
        height: 4rem;
        line-height: 4rem;
        -ms-flex-direction: row;
        flex-direction: row;
        padding-right: 1rem;
        & .warnImg{
          width:2.4rem;
          float:left;
          margin-top: 0.8rem;
          margin-right: 1rem;
        }
        & .row_img{
          width: 1rem;
          float: right;
          margin-top: 1.5rem;
        }
        & .warn_div{
          font-size: 1.8rem;
          font-family: 'Microsoft YaHei';
          color: #6c7079;
          width: 70%;
          float: left;
        }
      }
      & .warn_body{
        & div{
          font-size:1.8rem;
          font-family:'Microsoft YaHei';
          line-height:2.5rem;
          color:#9498a2;
        }
      }
    }
  }

</style>
<script>
import functions from '../../functions'
export default{
  name: 'warnfactor',
  data () {
    return {
      items: []
    }
  },
  created () {
    this.renderData()
    window.back = this.prev
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '预警因子' })
    } catch (e) {

    }
  },
  methods: {
    renderData: function () {
      var self = this
      var token = functions.getParam('token')
      this.$http.jsonp(
        functions.getURL('warning/w-item-detail'),
        {
          params: {
            access_token: token,
            id: this.$route.params.warn_id
          }
        }).then(
        function (obj) {
          console.log(obj, '收到的数据')
          var reportdata = obj.data.data.report_data
          if (Array.isArray(reportdata)) {
            for (var i = 0; i < reportdata.length; i++) {
              var reportObj = reportdata[i]
              reportObj['index'] = i
              reportObj['show'] = false
              self.items.push(reportObj)
            }
            console.log(self.items)
          }
        }, function () {
          window.$.invoke('showMessage', { message: '网络请求失败' })
        })
    },
    clickShownT: function (number) {
      if (!this.items[number].show) {
        this.items[number].show = true
      } else {
        this.items[number].show = false
      }
    },
    prev: function (event) {
      this.$router.go(-1)
      console.log('go back')
    }
  }
}
</script>
