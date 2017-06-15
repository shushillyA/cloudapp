<template>
  <div class="wrap">
    <div class='top'></div>
    <div class='listContainer'>
      <!--<section class='shell text' v-if='isShow'>暂无报告</section>-->
      <section class="shell" v-for="item in items">
        <router-link :to="{ name: 'evaluation_scalelist', params: { actjoin_id: item.activity_id, user_id: item.user_id}}">
          <div style='height:2rem' v-if='searchType!=="量表"'>
            <p>{{item.realname}}</p>
            <img src="../../assets/row.png" alt="">
          </div>
        </router-link>
        <router-link :to="{ name: 'evaluation_report', params: {userscale_id: item.user_id, actscale_id: item.activity_id, scale_id: scale_id}}">
          <div style='height:2rem' v-if='searchType==="量表"'>
            <p>{{item.realname}}</p>
            <img src="../../assets/row.png" alt="">
          </div>
        </router-link>
      </section>
    </div>
    <div class='loading' v-if='loadingShow'>
      <img src='../../assets/cloud_blue.gif'>
    </div>
  </div>
</template>

<style lang= 'postcss' scoped>
  .wrap {
    & .top {
      width: 100%;
      height: 5rem;
      background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#3095fc), to(#2cd2f1));
    }
    & .listContainer {
      margin-top: -3rem;
      & section {
        padding: 5% 4%;
        & p {
          float: left;
          color: #a5a6bb;
          font-size: 1.8rem;
        }
        & img {
          width: 3%;
          height: 1.4rem;
          float: right;
          margin-top: 0.2rem;
        }
      }
    }
  }
</style>
<script>
  import functions from '../../functions'
  export default {
    name: 'joinlist',
    created () {
      console.log('state' + this.$store.state.searchType)
      this.searchType = this.$store.state.searchType // 获取保存在state中的搜素类型
      this.scale_id = this.$store.state.evaluation.scale_id //  获取保存在state中的scale_id
      console.log(this.$store.state.evaluation.scale_id, '量表')
      var role = this.$route.params.role
      if (role === '教职工') {
        this.renderData('activity/get-activity-user')
      } else if (role === '学生' || role === '家长') {
        this.renderData('activity/get-activity-userbyclass')
      }
      window.back = this.prev
      try {
        window.$.invoke('toggleNavigation', { isShow: false })
        window.$.invoke('setTitle', { title: '参与人' })
      } catch (e) {

      }
    },
    data () {
      return {
        items: [],
        isShow: true,
        loadingShow: true,
        searchType: '',
        scale_id: ''
      }
    },
    methods: {
      // // 渲染数据
      // renderData: function (url) {
      //   var self = this
      //   self.items = []
      //   // url = url + '&' + this.$route.params.ce_type
      //   var token = functions.getParam('token')
      //   // console.log(token)
      //   console.log(self.$route.params)
      //   var role = self.$route.params.role
      //   if (role === '教职工') {
      //     url = url + token + '&act_id=' + self.$route.params.act_id
      //   } else if (role === '学生' || role === '家长') {
      //     // url = url + token + '&act_id=' + self.$route.params.act_id + '&class_id=' + window.localStorage.getItem('class_id')
      //     url = url + token + '&act_id=' + self.$route.params.act_id + '&class_id=' + this.$store.state.evaluation.class_id
      //   }
      //   console.log(url)
      //   window.$.jsonp(url, function (obj) {
      //     var results = obj.data.user
      //     console.log(results)
      //     try {
      //       for (var i = 0; i < results.length; i++) {
      //         results[i]['act_id'] = self.$route.params.act_id
      //         self.items.push(results[i])
      //       }
      //       if (self.items.length === 0) {
      //         self.isShow = true
      //         self.loadingShow = true
      //       } else {
      //         self.isShow = false
      //         self.loadingShow = false
      //       }
      //     } catch (e) {

      //     }
      //     console.log(self.items)
      //   })
      // },
      renderData: function (url) {
        var self = this
        self.items = []
        var token = functions.getParam('token')
        var role = self.$route.params.role
        var sendData
        if (role === '教职工') {
          sendData = {
            access_token: token,
            act_id: self.$route.params.act_id
          }
        } else if (role === '学生' || role === '家长') {
          sendData = {
            access_token: token,
            act_id: self.$route.params.act_id,
            class_id: this.$store.state.evaluation.class_id
          }
        }
        this.$http.jsonp(
          functions.getURL(url),
          {
            params: sendData
          }).then(
            function (obj) {
              console.log(obj, '收到的数据')
              var results = obj.data.data.user
              console.log(results)
              try {
                for (var i = 0; i < results.length; i++) {
                  results[i]['act_id'] = self.$route.params.act_id
                  self.items.push(results[i])
                }
                if (self.items.length === 0) {
                  self.isShow = true
                  self.loadingShow = true
                } else {
                  self.isShow = false
                  self.loadingShow = false
                }
              } catch (e) {

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
