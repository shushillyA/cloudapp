<template>
  <div class='wrap'>
    <div class='top'></div>
    <div class='content'>
      <section class='shell'>
        <div>{{title}}</div>
        <div>
          <p>发布时间：{{sendtime}}</p>
          <p>编辑：{{writer}}</p>
        </div>
      </section>
      <section class='shell'>
        <span></span>
        <span>心理心语：</span>
        <p v-html='body'></p>
      </section>
    </div>
  </div>

</template>
<style lang='postcss' scoped>
.shell{
  padding: 1rem 2rem;
}
.top{
  width: 100%;
  height: 5.6rem;
  background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#3095fc), to(#2cd2f1));
}
.content{
  margin-top:-3rem;
  margin-bottom: 3rem;
  & section:nth-child(1) {
    & div:nth-child(1) {
      font-size: 1.8rem;
      color: #515974;
      height: 3rem;
      line-height: 3rem;
      width:90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    & div:nth-child(2){
      height: 3rem;
      line-height: 2.5rem;
      font-size:1.7rem;
      color:#c5c5cd;
      & p:nth-child(1) {
        float:left;
      }
      & p:nth-child(2){
        float:right;
      }
    }
  }
 
  & section:nth-child(2){
    & span:nth-child(1) {
      display: inline-block;
      width: 1.2rem;
      height: 1.2rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%,from(#2ca7ec), to(#1cd7ff));
      box-shadow: 0 0 0.5rem #56dcf9;
      border-radius: 0.5rem;
      margin-right: 1rem;
      float: left;
      margin-top: 0.8rem;
    }
    & span:nth-child(2), & p {
      font-size:1.8rem;
      color:#919197;
      line-height:2.8rem;
    }
  }
}
</style>
<script>
import functions from '../../functions'
export default {
  name: 'secretddetail',
  created () {
    window.back = this.prev
    try {
      window.$.invoke('toggleNavigation', { isShow: false })
      window.$.invoke('setTitle', { title: '文章详情' })
    } catch (e) {
    }
    this.renderData()
  },
  data () {
    return {
      title: '',
      sendtime: '',
      writer: '',
      body: ''
    }
  },
  methods: {
    renderData: function () {
      var self = this
      var token = functions.getParam('token')
      console.log(self.$route.params.article_id)
      var sendData = {
        access_token: token,
        article_id: self.$route.params.article_id
      }
      this.$http.jsonp(
        functions.getURL('psychology-scout/detail'),
        {
          params: sendData
        }).then(
          function (obj) {
            var results = obj.data.data
            self.title = results.title
            self.sendtime = results.sendtime
            self.writer = results.writer
            self.body = results.body.replace(/<\s?img[^>]*>/gi, '')
          }, function () {
            window.$.invoke('showMessage', { message: '网络请求失败' })
          })
    },
    prev: function (event) {
      this.$router.go(-1)
      try {
        this.$invoke('toggleNavigation', { isShow: true })
        this.$invoke('setTitle', { title: '首页' })
      } catch (e) {
      }
      console.log('go back')
    }
  }
}
</script>
