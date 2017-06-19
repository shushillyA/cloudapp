<template>
  <div class='wrap'>
    <section class='title'></section>
    <div class='content'>
      <section class='shell' v-for='item in items'>
        <h2 v-on:click='change(item)'><span></span>{{item.name}}<img src='../../assets/row.png' class='row_img' :style="item.expanded?'transform:rotate(90deg)':''"></h2>
        <ul class='detail' v-show="item.expanded">
          <li v-for='scale in item.labels' v-on:click='choose(scale)'>{{scale.name}}<span></span>
            <img v-if="!scale.selected" src='../../assets/no.png'>
            <img v-if="scale.selected" src='../../assets/yes.png'>
          </li>
        </ul>
      </section>
      <section class='shell'>
        <h2><span></span>备注</h2>
        <textarea id='msg_text' cols="30" rows="10" placeholder="可输入300字以内的行为备注...." v-model='behaveDetail'></textarea>
        <div class='tip' v-show='tipShow'>超出字符限制，请控制在300字以内</div>
      </section>
        <p v-on:click='getTag'>行为说明</p>
      <div class='empty'></div>
    </div>
  </div>
</template>
<style lang='postcss' scoped>
  .wrap{
    & .title{
      width:100%;
      height:5rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
    }
    & .content{
      margin-top:-3rem;
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
        & .detail{
          & li{
            font-size:1.6rem;
            color:#babbcf;
            line-height:3.5rem;
            & span{
              display:inline-block;
              width:68%;
              height:1rem;
              border-bottom:2px dotted #babbcf;
              margin-left:1rem;
            }
            & img{
              width:1.6rem;
              float:right;
              margin-top:1rem;
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
        & .tip{
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
      & p {
        font-size:1.6rem;
        color:#3dbfff;
        margin-left:6%;
      }
      & .empty{
        height:10rem;
      }
    }
  }
  
  
  
  
</style>
<script>
import functions from '../../functions'
// var params
export default {
  name: 'behave',
  created () {
    window.clickButton = this.clickButton
    this.behaveDetail = this.$store.state.record.behaveDetail
    this.renderData()
    window.back = this.prev
    try {
      this.$invoke('toggleNavigation', { isShow: false })
      this.$invoke('setTitle', { title: '异常表现' })
      this.$invoke('showButton', { text: '确定' })
    } catch (e) {

    }
  },
  data () {
    return {
      items: [],
      details: [],
      labels: [],
      isShow: true,
      tipShow: false,
      // behaveDetail: ''
      // behaveDetail: JSON.parse(window.localStorage.getItem('recordParams')).behaveDetail,
      behaveDetail: '',
      // behaveDetail: this.$store.state.record.behaveDetail,
      selectsBehave: []
    }
  },
  watch: {// 监听输入框的字符长度
    behaveDetail: function (newVal, oldVal) {
      if (newVal.length > 300) {
        this.$invoke('showMessage', {message: '超出字符限制，请控制在300字以内'})
        this.behaveDetail = oldVal
      }
    }
  },
  methods: {
              // 渲染数据
    renderData: function () {
      // var url = 'v1/record/select-behavior.api?access_token='
      var url = `${functions.getURL('record/select-behavior')}?access_token=`
      var self = this
        // 渲染数据
      var token = functions.getParam('token')
      url = url + token
      console.log(url)
      this.$http.jsonp(functions.getURL('record/select-behavior'), functions.sendParam()).then(function (obj) {
          // console.log(obj);
        var results = obj.data.data.behavior_labels
        try {
          // selectsBehave = []
          // params = window.localStorage.getItem('recordParams')
          // if (!params) {
          //   params = {}
          // } else {
          //   params = JSON.parse(params)
          // }
          // if (params.behaves) {
          // if (self.$store.state.record.behaves) {
          self.selectsBehave = self.$store.state.record.behaves
          // }
          for (var i = 0; i < results.length; ++i) {
            results[i].expanded = false
            for (var j = 0; j < results[i].labels.length; ++j) {
              results[i].labels[j].selected = false
              for (var k = 0; k < self.selectsBehave.length; ++k) {
                if (self.selectsBehave[k] === results[i].labels[j].record_label_id) {
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
      //     // console.log(obj);
      //   var results = obj.data.behavior_labels
      //   try {
      //     // selectsBehave = []
      //     // params = window.localStorage.getItem('recordParams')
      //     // if (!params) {
      //     //   params = {}
      //     // } else {
      //     //   params = JSON.parse(params)
      //     // }
      //     // if (params.behaves) {
      //     // if (self.$store.state.record.behaves) {
      //     self.selectsBehave = self.$store.state.record.behaves
      //     // }
      //     for (var i = 0; i < results.length; ++i) {
      //       results[i].expanded = false
      //       for (var j = 0; j < results[i].labels.length; ++j) {
      //         results[i].labels[j].selected = false
      //         for (var k = 0; k < self.selectsBehave.length; ++k) {
      //           if (self.selectsBehave[k] === results[i].labels[j].record_label_id) {
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
        this.selectsBehave.push(scale.record_label_id)
      } else {
        for (var i = 0; i < this.selectsBehave.length; ++i) {
          if (this.selectsBehave[i] === scale.record_label_id) {
            this.selectsBehave.splice(i, 1)
            break
          }
        }
      }
      console.log(this.selectsBehave)
    },
    clickButton: function () {
      // if (this.selectsBehave.length > 0) {
      // this.$store.state.record.behaves = this.selectsBehave
      // } else {
        // params.behaves = ''
      // }
      // if (this.behaveDetail.length > 0) {
      console.log(this.behaveDetail, '详情')
      this.$store.state.record.behaveDetail = this.behaveDetail
      console.log(this.$store.state.record, '111')
      // } else {
        // params.behaveDetail = ''
      // }
      // window.localStorage.setItem('recordParams', JSON.stringify(params))
      this.$nextTick(function () { // 进入搜索界面不搜索直接返回时输入框失去焦点，收起软键盘
        document.getElementById('msg_text').blur()
      })
      this.$router.go(-1)
    },
    getTag: function () {
      this.$store.state.record.behaveDetail = this.behaveDetail
      this.$router.push({path: '/record/add/behave/tagdetail'})
      this.$router.go(1)
    },
    prev: function (event) {
      this.$nextTick(function () { // 进入搜索界面不搜索直接返回时输入框失去焦点，收起软键盘
        document.getElementById('msg_text').blur()
      })
      this.$router.go(-1)
      console.log('go back')
    }
  }
}

</script>
