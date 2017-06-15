import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import Home from '../components/home'
import Redirector from '../components/redirector'
import Warning from '../components/warning/Warning'
import SearchWarn from '../components/warning/SearchWarn'
import WarnFactor from '../components/warning/WarnFactor'
import Evaluation from '../components/evaluation/Evaluation'
import EvaluationClassList from '../components/evaluation/ClassList'
import EvaluationJoinList from '../components/evaluation/JoinList'
import EvaluationScaleList from '../components/evaluation/ScaleList'
import EvaluationActivityList from '../components/evaluation/ActivityList'
import EvaluationReport from '../components/evaluation/Report'
import EvaluationSearchEvaluation from '../components/evaluation/SearchEvaluation'
import Talking from '../components/talking/Talking'
import TalkingDetail from '../components/talking/TalkingDetail'
import SearchTalking from '../components/talking/SearchTalking'
import SandTable from '../components/sandtable/SandTable'
import SearchSandTable from '../components/sandtable/SearchSandTable'
import SandReport from '../components/sandtable/SandReport'
import RecordList from '../components/record/List'
import RecordListDetail from '../components/record/ListDetail'
import RecordSearch from '../components/record/Search'
import RecordAdd from '../components/record/Add'
import RecordAddStudent from '../components/record/AddStudent'
import RecordAddBehave from '../components/record/AddBehave'
import RecordAddEffect from '../components/record/AddEffect'
import RecordTagDetail from '../components/record/TagDetail'
import Cognition from '../components/cognition/Cognition'
import CognitionClass from '../components/cognition/CognitionClass'
import SearchCognition from '../components/cognition/SearchCognition'
import CognitionReport from '../components/cognition/CognitionReport'
import Article from '../components/article/Article'
import SearchArticle from '../components/article/SearchArticle'
import ArticleDetail from '../components/article/ArticleDetail'
import Behavior from '../components/behavior/List'
import SchoolDetail from '../components/behavior/SchoolDetail'
import DateDetail from '../components/behavior/DateDetail'
import RecordDetail from '../components/behavior/RecordDetail'
import SearchSchool from '../components/behavior/SearchSchool'
import Filter from '../components/behavior/Filter'
import SheetList from '../components/behavior/SheetList'

const router = new VueRouter({
  routes: [
    { path: '/', component: Redirector },
    { path: '/home/', component: Home, name: 'home' },
    { path: '/evaluation/', component: Evaluation },
    { path: '/warning/', component: Warning },
    { path: '/warning/:type/', component: Warning, name: 'home_newwarn' },
    { path: '/warning/:type/', component: Warning, name: 'home_sumwarn' },
    { path: '/warning/warnfactor/:warn_id/', component: WarnFactor, name: 'warnfactor' },
    { path: '/warning/searchwarn/:warnState', component: SearchWarn, name: 'searchwarn' },
    { path: '/evaluation/', component: Evaluation, name: 'home_evaluation' },
    { path: '/evaluation/classlist/:act_id/', component: EvaluationClassList, name: 'evaluation_classlist' },
    { path: '/evaluation/classlist/joinlist/:act_id/:role', component: EvaluationJoinList, name: 'evaluation_joinlist' },
    { path: '/evaluation/classlist/joinlist/scalelist/:actjoin_id/:user_id', component: EvaluationScaleList, name: 'evaluation_scalelist' },
    { path: '/evaluation/classlist/joinlist/scalelist/report/:userscale_id/:actscale_id/:scale_id', component: EvaluationReport, name: 'evaluation_report' },
    { path: '/evaluation/activitylist/:act_id/', component: EvaluationActivityList, name: 'evaluation_activitylist' },
    { path: '/evaluation/searchevaluation/:evalState', component: EvaluationSearchEvaluation, name: 'search_evaluation' },
    { path: '/talking/', component: Talking, name: 'home_talking' },
    { path: '/talking/talkingdetail/:access_token/:user_id/:name/:age/:class_name/:role_name', component: TalkingDetail, name: 'talkingdetail' },
    { path: '/talking/searchtalking/:talkSign', component: SearchTalking, name: 'searchtalking' },
    { path: '/sandtable/', component: SandTable, name: 'home_sandtable' },
    { path: '/sandtable/searchsandtable/:sandSign', component: SearchSandTable, name: 'searchsandtable' },
    { path: '/sandtable/searchsandtable/sandreport/:report_id/:name/:sex/:class_name/:age/:create_time/:costtime/:report_no', component: SandReport, name: 'sandreport' },
    { path: '/record/', component: RecordList, name: 'record' },
    { path: '/record/detail/', component: RecordListDetail, name: 'detail' },
    { path: '/record/search/', component: RecordSearch, name: 'recordsearch' },
    { path: '/record/add/', component: RecordAdd },
    { path: '/record/add/student/', component: RecordAddStudent },
    { path: '/record/add/behave/', component: RecordAddBehave },
    { path: '/record/add/effect/', component: RecordAddEffect },
    { path: '/record/add/behave/tagdetail/', component: RecordTagDetail, name: 'tagdetail' },
    { path: '/cognition/', component: Cognition, name: 'cognition' },
    { path: '/cognition/cognitionclass/:class_id/', component: CognitionClass, name: 'cognitionclass' },
    { path: '/cognition/searchcognition/:cogSign', component: SearchCognition, name: 'searchcognition' },
    { path: '/cognition/cognitionreport/:user_id/:realname/:finish/:class_name/:last_warning_level/:clothbag_id/:solution_id/:now_warning_level/', component: CognitionReport, name: 'cognitionreport' },
    { path: '/article/', component: Article, name: 'article' },
    { path: '/article/searcharticle/:secretSign', component: SearchArticle, name: 'searcharticle' },
    { path: '/article/articledetail/:article_id', component: ArticleDetail, name: 'articledetail' },
    { path: '/behavior/list', component: Behavior, name: 'behavior' },
    { path: '/behavior/list/schooldetail/', component: SchoolDetail, name: 'schooldetail' },
    { path: '/behavior/list/schooldetail/searchschool', component: SearchSchool, name: 'searchschool' },
    { path: '/behavior/list/schooldetail/:org_id/:ids/:date/:day', component: DateDetail, name: 'datedetail' },
    { path: '/behavior/list/schooldetail/datedetail/recorddetail/', component: RecordDetail, name: 'recorddetail' },
    { path: '/behavior/filter/', component: Filter, name: 'filter' },
    { path: '/behavior/', component: SheetList, name: 'sheetlist' }
  ]
})

export default router
