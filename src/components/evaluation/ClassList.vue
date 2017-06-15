<template>
  <div class="wrap">
    <div class='top'></div>
    <div id='noContent' v-if='isShow'>
      <img src='../../assets/logo_no.png'>
      <p>暂无内容</p>
    </div>
    <div class='listContainer'>
      <section class="shell" v-for="item in items">
        <router-link :to="{ name: 'evaluation_joinlist', params: { act_id: act_id, role: role}}">
          <div style='height:2rem' v-on:click='saveClassId(item)'>
            <!--<p>{{item.name.fullName}}</p>-->
            <p>{{item.name}}</p>
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

<style lang='postcss' scoped>
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
    name: 'classlist',
    created () {
      window.back = this.prev
      this.renderData()
      try {
        window.$.invoke('toggleNavigation', { isShow: false })
        window.$.invoke('setTitle', { title: '班级' })
      } catch (e) {

      }
    },
    data () {
      return {
        items: [],
        isShow: false,
        loadingShow: true,
        role: window.$.roleArr[window.$.roleArr.length - 1],
        act_id: ''
      }
    },
    methods: {
      renderData: function () {
        var self = this
        self.items = []
        var token = functions.getParam('token')
        var sendData = {
          access_token: token,
          act_id: self.$route.params.act_id
        }
        this.$http.jsonp(
          functions.getURL('activity/get-activity-classes'),
          {
            params: sendData
          }).then(
            function (obj) {
              console.log(obj, '收到的数据shujugenggai')
              var results = obj.data.data.class
              self.act_id = obj.data.data.act_id
              console.log(results)
              try {
                for (var i = 0; i < results.length; i++) {
                  self.items.push(results[i])
                }
              } catch (e) {

              }
              console.log(self.items)
              if (self.items.length === 0) {
                self.isShow = true
                self.loadingShow = true
              } else {
                self.isShow = false
                self.loadingShow = false
              }
            }, function () {
              window.$.invoke('showMessage', { message: '网络请求失败' })
            })
      },
      prev: function (event) {
        this.$router.go(-1)
        console.log('go back')
      },
      saveClassId: function (item) {
        this.$store.state.evaluation.class_id = item.id
      }
    }
  }

</script>
