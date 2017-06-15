<template>
  <div class="wrap">
    <div class='top'></div>
    <div class='listContainer'>
      <!--学生和家长跳转到班级-->
      <section class="shell" v-for="item in items">
        <router-link :to="{ name: 'evaluation_classlist', params: { act_id: item.id, role: item.user_type}}">
          <div style='height:2rem' v-if="item.user_type==='学生' || item.user_type==='家长'">
            <p>{{item.title}}</p>
            <img src="../../assets/row.png" alt="">
          </div>
        </router-link>
        <!--教职工跳转到参与人-->
        <router-link :to="{ name: 'evaluation_joinlist', params: { act_id: item.id, role: item.user_type}}">
          <div style='height:2rem' v-if="item.user_type=='教职工'">
            <p>{{item.title}}</p>
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
    name: 'activitylist',
    created () {
      window.back = this.prev
      try {
        this.$invoke('toggleNavigation', { isShow: false })
        this.$invoke('setTitle', { title: '活动列表' })
      } catch (e) {

      }
      this.renderData()
    },
    data () {
      return {
        items: [],
        isShow: true,
        loadingShow: true
      }
    },
    methods: {
      // 渲染数据
      renderData: function () {
        var self = this
        self.items = []
        this.$http.jsonp(functions.getURL('activity/get-act'), functions.sendParam({'act_id': self.$route.params.act_id})).then(function (obj) {
          console.log(obj, '收到的数据')
          var results = obj.data.data.activity_data.list
          console.log(results)
          try {
            for (var i = 0; i < results.length; i++) {
              if (parseInt(results[i].user_type) === 1) {
                results[i].user_type = '学生'
              } else if (parseInt(results[i].user_type) === 2) {
                results[i].user_type = '家长'
              } else if (parseInt(results[i].user_type) === 3) {
                results[i].user_type = '教职工'
              }
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
          console.log(self.items)
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
