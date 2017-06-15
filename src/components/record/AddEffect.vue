<template>
  <div class='wrap'>
    <section id='title'></section>
    <div id='content'>
      <section class='shell' v-for='item in items'>
        <h2 v-on:click='change(item)'><span></span>{{item.name}}<img src='../../assets/row.png' class='row_img' :style="item.expanded?'transform:rotate(90deg)':''"></h2>
        <ul id='detail' v-show="item.expanded">
          <li v-for='scale in item.labels' v-on:click='choose(scale)'>{{scale.name}}<span></span>
            <img v-if="!scale.selected" src='../../assets/no.png'>
            <img v-if="scale.selected" src='../../assets/yes.png'>
          </li>
        </ul>
      </section>
      <section class='shell'>
        <h2><span></span>备注</h2>
        <textarea id='msg_text' cols="30" rows="10" placeholder="可输入300字以内的行为备注...." v-model='effectDetail'></textarea>
        <div id='tip' v-show='tipShow'>超出字符限制，请控制在300字以内</div>
      </section>
      <div class='empty'></div>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    & #title{
      width:100%;
      height:5rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
    & #content{
      margin-top:-3rem;
      & a {
        font-size:1.6rem;
        color:#3dbfff;
        margin-left:6%;
      }
    }
    & .shell{
      & h2{
        font-size:1.7rem;
        color:#a5a6bb;
        line-height:3rem;
        & span{
          display:inline-block;
          width:1rem;
          height:1rem;
          background:-webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
          box-shadow: 0 0 0.5rem #56dcf9;
          border-radius:0.5rem;
          margin-right:1rem;
        }
        & img{
          width: 1rem;
          height: 1rem;
          float: right;
          margin-top:1rem;
        }
      }
      & #detail{
        & li{
          font-size:1.6rem;
          color:#babbcf;
          line-height:3.5rem;
          & img{
            width:1.6rem;
            float:right;
            margin-top:1rem;
          }
          & span{
            display:inline-block;
            width:68%;
            height:1rem;
            border-bottom:2px dotted #babbcf;
            margin-left:1rem;
          }
        }
      }
      & ::-webkit-input-placeholder { 
        color: #d3d5e1; 
        text-overflow: ellipsis; 
      }
      & #msg_text{
        width: 100%;
        padding: 1rem;
        line-height: 2rem;
        font-size: 1.6rem;
        color: #a5a6bb;
        font-family: 'Microsoft YaHei';
        border: none;
      }
      & #tip{
        background-color: #5f686d;
        width: 75%;
        height: 5rem;
        line-height: 5rem;
        margin: 0 auto;
        text-align: center;
        font-size: 1.6rem;
        border-radius: 0.5rem;
        color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,100%);
      }
    }
    & .empty{
      height:10rem;
    }
  }
</style>
<script>
// var BEHAVE_URL = 'https://cloudappapi.test.xlhb.com/v1/record/select-effect.api?access_token='
import functions from '../../functions'
// var params, selectsEffect
export default {
  name: 'effect',
  created () {
    this.selectsEffect = this.$store.state.record.effects
    this.effectDetail = this.$store.state.record.effectDetail
    window.clickButton = this.clickButton
    this.renderData()
    window.back = this.prev
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '生活事件' })
      this.$invoke('showButton', { text: '确定' })
    } catch (e) {

    }
  },
  data () {
    return {
      items: [],
      details: [],
      scales: [],
      isShow: true,
      detailShow: false,
      tipShow: false,
      // effectDetail: JSON.parse(window.localStorage.getItem('recordParams')).effectDetail
      // 详情
      effectDetail: '',
      // 选中的
      selectsEffect: []
    }
  },
  watch: {
    effectDetail: function (newVal, oldVal) {
      if (newVal.length > 300) {
        this.$invoke('showMessage', {message: '超出字符限制，请控制在300字以内'})
        this.effectDetail = oldVal
      }
    }
  },
  methods: {
               // 渲染数据
    renderData: function () {
      // var url = 'https://cloudappapi.test.xlhb.com/v1/record/select-effect.api?access_token='
      var self = this
        // 渲染数据
      // var token = functions.getParam('token')
      // url = url + token
      this.$http.jsonp(functions.getURL('record/select-effect'), functions.sendParam()).then(function (obj) {
        var results = obj.data.data.element_labels
        try {
          // selectsEffect = []
          // var countBehave = 0 // 标签选中状态的个数
          // params = window.localStorage.getItem('recordParams')
          // if (!params) {
            // params = {}
          // } else {
            // params = JSON.parse(params)
          // }
          // if (params.effects) {
            // selectsEffect = params.effects
          // }

          for (var i = 0; i < results.length; ++i) {
            results[i].expanded = false
            for (var j = 0; j < results[i].labels.length; ++j) {
              results[i].labels[j].selected = false
              for (var k = 0; k < self.selectsEffect.length; ++k) {
                if (self.selectsEffect[k] === results[i].labels[j].record_label_id) {
                  results[i].labels[j].selected = true
                  break
                }
              }
            }
          }
          self.items = results
        } catch (e) {

        }
      }, function () {
        window.$.invoke('showMessage', { message: '网络请求失败' })
      })
      // window.$.jsonp(url, function (obj) {
      //   console.log(url)
      //   var results = obj.data.element_labels
      //   try {
      //     // selectsEffect = []
      //     // var countBehave = 0 // 标签选中状态的个数
      //     // params = window.localStorage.getItem('recordParams')
      //     // if (!params) {
      //       // params = {}
      //     // } else {
      //       // params = JSON.parse(params)
      //     // }
      //     // if (params.effects) {
      //       // selectsEffect = params.effects
      //     // }

      //     for (var i = 0; i < results.length; ++i) {
      //       results[i].expanded = false
      //       for (var j = 0; j < results[i].labels.length; ++j) {
      //         results[i].labels[j].selected = false
      //         for (var k = 0; k < self.selectsEffect.length; ++k) {
      //           if (self.selectsEffect[k] === results[i].labels[j].record_label_id) {
      //             results[i].labels[j].selected = true
      //             break
      //           }
      //         }
      //       }
      //     }
      //     self.items = results
      //   } catch (e) {

      //   }
      // })
    },
    change: function (item) {
      item.expanded = !item.expanded
    },
    choose: function (scale) {
      scale.selected = !scale.selected
      if (scale.selected) {
        this.selectsEffect.push(scale.record_label_id)
      } else {
        for (var i = 0; i < this.selectsEffect.length; ++i) {
          if (this.selectsEffect[i] === scale.record_label_id) {
            this.selectsEffect.splice(i, 1)
            break
          }
        }
      }
      console.log(this.selectsEffect)
    },
    clickButton: function () {
      // if (selectsEffect.length > 0) {
      this.$store.state.record.effects = this.selectsEffect
      // } else {
        // params.effects = ''
      // }
      // if (this.effectDetail.length > 0) {
      this.$store.state.record.effectDetail = this.effectDetail
      // } else {
        // params.effectDetail = ''
      // }
      // window.localStorage.setItem('recordParams', JSON.stringify(params))
      this.$nextTick(function () { // 进入搜索界面不搜索直接返回时输入框失去焦点，收起软键盘
        document.getElementById('msg_text').blur()
      })
      this.$router.go(-1)
    },
    prev: function (event) {
      console.log('go back')
      this.$nextTick(function () { // 进入搜索界面不搜索直接返回时输入框失去焦点，收起软键盘
        document.getElementById('msg_text').blur()
      })
      this.$router.go(-1)
    }
  }
}

</script>
