<template>
  <div class="wrap">
    <div class='top'></div>
    <div class='listContainer'>
      <section class="shell" v-for="item in items">
        <router-link :to="{ name: 'evaluation_report', params: {userscale_id: item.user_id, actscale_id: item.act_id, scale_id: item.id}}">
          <div style='height:2rem'>
            <p>{{item.title}}</p>
            <img src="../../assets/row.png" alt="">
          </div>
        </router-link>
      </section>
      <div class='loading' v-if='loadingShow'>
        <img src='../../assets/cloud_blue.gif'>
      </div>
    </div>
  </div>
</template>

<style lang='postcss' scoped >
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
          width: 91%;
          height: 2.2rem;
          overflow: hidden;
          text-overflow: ellipsis;
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
    name: 'scalelist',
    created () {
      window.back = this.prev
      this.renderData()
      try {
        window.$.invoke('toggleNavigation', { isShow: false })
        window.$.invoke('setTitle', { title: '报告列表' })
      } catch (e) {

      }
    },
    data () {
      return {
        items: [],
        loadingShow: true
      }
    },
    methods: {
      // 渲染数据
      renderData: function () {
        // var url = 'v1/activity/get-activity-user-scale.api?access_token='
        var url = `${functions.getURL('activity/get-activity-user-scale')}?access_token=`
        var self = this
        self.items = []
        // url = url + '&' + this.$route.params.ce_type
        var token = functions.getParam('token')
        // console.log(token)
        console.log(self.$route.params)
        url = url + token + '&act_id=' + self.$route.params.actjoin_id + '&user_id=' + self.$route.params.user_id
        console.log(url)
        this.$http.jsonp(functions.getURL('activity/get-activity-user-scale'), functions.sendParam({
          'act_id': self.$route.params.actjoin_id,
          'user_id': self.$route.params.user_id
        })).then(function (obj) {
          console.log(obj, '收到的数据')
          var results = obj.data.data.Scale
          console.log(results)
          try {
            for (var i = 0; i < results.length; i++) {
              results[i]['act_id'] = self.$route.params.actjoin_id
              results[i]['user_id'] = self.$route.params.user_id
              self.items.push(results[i])
            }
          } catch (e) {

          }
          if (self.items.length === 0) {
            self.loadingShow = true
          } else {
            self.loadingShow = false
          }
          console.log(self.items)
        }, function () {
          window.$.invoke('showMessage', { message: '网络请求失败' })
        })
        // window.$.jsonp(url, function (obj) {
        //   var results = obj.data.Scale
        //   console.log(results)
        //   try {
        //     for (var i = 0; i < results.length; i++) {
        //       results[i]['act_id'] = self.$route.params.actjoin_id
        //       results[i]['user_id'] = self.$route.params.user_id
        //       self.items.push(results[i])
        //     }
        //   } catch (e) {

        //   }
        //   if (self.items.length === 0) {
        //     self.loadingShow = true
        //   } else {
        //     self.loadingShow = false
        //   }
        //   console.log(self.items)
        // })
      },
      prev: function (event) {
        this.$router.go(-1)
        console.log('go back')
      }
    }
  }

</script>
