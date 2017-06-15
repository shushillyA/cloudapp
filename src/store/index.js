import Vue from 'vue'
import Vuex from 'vuex'
// import VueResource from 'vue-resource'
Vue.use(Vuex)
// Vue.use(VueResource)
const store = new Vuex.Store({
  state: {
    noWLAN: {
      index: '',    // 这个页面的标识符
      home: {
        data: {}   // 保存的数据
      },
      sheetList: {
        data: {},
        area: false
      }
    },
    page: '',
    count: '',
    pageSizze: '',
    key: '',
    role: '',
    HomeEducObj: '',
    list: {
      recordTemp: [],
      stationArr: []
    },
    warning: {
      searchType: '',
      warningArr: [],
      storageArr: [],
      dataList: []
    },
    article: {
      articleArr: [],
      searchArticleArr: []
    },
    cognition: {
      cognitionArr: [],
      searchCogArr: []
    },
    talking: {
      talkingArr: [],
      searchTalkingArr: []
    },
    record: {
      // list列表 保存的数据
      recordTemp: [],
      dealShow: '',
      // 搜索学生列表
      recordParams: [],
      // 保存的高度
      heightArr: [],
      // page
      page: '',
      count: 0,
      pageSize: 0,
      // add保存数据
      id: '',
      student: '',
      realname: '',
      // 选中的behaves
      behaves: [],
      // 记录字符串
      behaveDetail: '',
      // 选中的
      effects: [],
      // 字符串
      effectDetail: '',
      // 搜索学生列表
      recordSearchTemp: [],
      searchRecordArr: [],
      recordKey: null,
      recordSign: null
    },
    evaluation: {
      class_id: null,
      evalState: 1,
      evalTemp: [],
      evalStationY: [],
      evalStorage: [],
      evalKey: null,
      searchEvalType: '',
      stateNum: 1,
      searchEvaluationArr: [],
      dataST: [],
      key: ''
    },
    sand: {
      sandTable: [],
      sandTemp: [],
      sandKey: null,
      sandTableArr: []
    },
    behavior: {
      isArea: false,
      page: 0,
      pageSize: 0,
      count: 0,
      heightArr: [],  // 高度数组
      dateHeightArr: [], // 日期列表高度数组
      behaviorTemp: [],  // 保存的数据
      behaviorKey: null,
      year: '',
      month: '',
      areaCode: '',
      area: '',
      schoolArr: [],
      dateArr: [],
      timer: '',
      date: '',
      school: '',
      filterFlag: true, // 筛选
      sheetFlag: false, // 图标
      fitlerMonth: '', // 筛选月
      currentWeek: '', // 第一次渲染的当前周
      sendData: {},
      flag: 100,  // 返回falg
      prev: 0,
      area1: '',   // 图标页面的area
      preDate: '',
      nextDate: '',
      recordId: '',
      org_id: ''
    }
  },
  mutations: {
    // increment (state, payload) { // 载荷形式
    //   // 变更状态
    //   state.recordTemp = payload.recordTemp
    //   // state.role = payload.role
    //   state.searchType = payload.searchType
    // }
    recordToInit (state) {
      state.record.id = ''
      state.record.realname = ''
      state.record.behaves = []
      state.record.behaveDetail = ''
      state.record.effects = []
      state.record.effectDetail = ''
    }
  },
  actions: {
  }
})

export default store
