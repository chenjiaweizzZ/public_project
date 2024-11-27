<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png"/>
                </a>
            </div>
          个人综合考评表审核
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab :title="tobeaudit" :active="type == 1" :bus="bus" data="1"></c-tab>
            <c-tab title="已鉴定" :active="type == 2" :bus="bus" data="2" @click="gradeList=true" ></c-tab>
        </c-tabs>

        <div class="g-main" >
            <div class="toDentifyListWrap" v-show='type == 1'>
                <div class="toDentifyList">
                    <!--列表-->
                    <load-more :loading-text="loadingText" :infinite-loading='isgetmore' :to-top='istotop'
                               @getmore='init()'>
                        <to-dentify @getTime="setShow" :data-list="data" @greadtrue="greadtrue"></to-dentify>
                    </load-more>
                    <no-content v-show="iscontent"></no-content>
                </div>
            </div>
            <div v-show='type == 2'>
                <!-- <has-dentify :data-list="hasdata" @type="type" :gradeList="gradeList"></has-dentify> -->
                    <van-list
                        v-model="loading"
                        :finished="finished"
                        finished-text="没有更多了"
                        @load="onLoad"
                        :immediate-check="false"
                    >
                        <div class="PVelQ" v-for="item in hasdata" :key="item" @click="todetail(item.grade,item.yearflag)">
                            <span class="IlcPRs">{{ item.gradename }}第{{ item.yearflag }}年度</span>
                            <span class="PbwTy">{{ item.count }}人<van-icon name="arrow" /></span>
                        </div>
                    </van-list>
            </div>
        </div>

        <!--选择年级 -->
        <c-picker :config="seltype" @confirm="getseachgrade"></c-picker>
    </div>

</template>
<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import methods from '@/methods';
    import cHeader from '../header';
    import cTab from '@/components/tab'
    import cTabs from '@/components/tabs';
    import cPicker from '../../components/default-picker';
    import toDentify from './to_dentify';
    import hasDentify from './has_dentify';
    import loadMore from '@/components/load-more';
    import noContent from '@/views/no_content.vue';
    import {mapState,mapActions} from 'vuex';
    import { List } from 'vant'
    let bus = new Vue();
    export default {
        name: '',
        components: {
            cHeader,
            cTab,
            cTabs,
            toDentify,
            hasDentify,
            noContent,
            loadMore,
            cPicker
        },
        data(){
            return{
                loading: false,
                finished: false,
                pageNum: 0,
                bus: bus,
                type: '',
                istotop:false,
                loadingText:'加载中~',
                isgetmore:true,
                iscontent:false,
                tobeaudit:'待鉴定（ 0 ）人',//待鉴定title
                data:[],
                gradeList:true,
                hasdata:[],
                pageSize:5,
                gettime:{
                   show: false,//是否显示
                },
                year:[2010,2028],
                seachgreade:'',
                seltype:{
                    show:false,
                    mainlist:[],
                    valueKey:'name'
                },
                count:''
            }
        },
        watch:{
            'type':function (value,oldvalue) {
                if(value){
                    this.seachgreade= '';
                    value == 1 ? this.init() : this.identified()
                }
            }
        },
        methods:{
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            //年级筛选
            greadtrue(data){
                this.seltype.show = data;
            },
            getseachgrade(data){
                this.seachgreade = data.key;
                this.init();
            },
            onRefresh() {
            // 清空列表数据
            this.finished = false;

            // 重新加载数据
            // 将 loading 设置为 true，表示处于加载状态
            this.loading = true;
            this.identified();
            },
            todetail(gread,year){
                this.$router.push({
                    // path:'/baseAudit/dentify_main',
                    name: "base_dentify_main_list",
                    query:{
                        gread:gread,
                        year: year,
                        count:this.hasdata.count
                    }
                });
            },
            onLoad() {
                let self= this;
                self.pageNum+=1;
                this.post('/turnedoctormain/gradelist', {
                    command: 'turnedoctormain/gradelist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    type:1,
                    pageSize: 20,
                    pageNum: self.pageNum
                }).done(data => {
                    if(data && data.errcode ==0){
                        self.isgetmore = true ;
                        if(data.beanList){
                            self.iscontent = false;
                            self.hasdata = self.hasdata.concat(data.beanList);
                            // self.hasdata.count = self.count;
                            if(data.beanList.length < 10) {
                                self.finished = true;
                                return;
                            }
                            self.loading = false;
                        }else {
                            self.iscontent = true
                        }
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            init() {    //待鉴定
                let self = this;
                this.post('/turnedoctormain/getuserpersonalevaluatebase', {
                    command: 'turnedoctormain/getuserpersonalevaluatebase',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    requestflag: 2, //2 老师请求
                    requesttype: 1,//1 查询基地待鉴定列表;
                    grade: self.seachgreade,      //
                    //page:'',
                    //pageSize:self.pageSize
                }).done(data => {
                     if(data && data.errcode ==0){
                        self.isgetmore = true ;
                        if(data.result.beanlist && data.result.beanlist.length >= 0){
                            self.iscontent = false;
                            self.data = data.result.beanlist;
                            self.tobeaudit = '待鉴定（' + data.result.beanlist.length + ' ) 人' ;
                            self.count = data.result.beanlist.length;
                            if(self.data.length==0){
                                 self.loadingText = ''
                            }
                            if(self.data.length < self.pageSize){
                                self.isgetmore = false ;
                                self.loadingText = '没有更多啦~'
                            }
                            self.pageSize += 10 ;
                        }else {
                            self.iscontent = true
                        }
                         self.seltype.show = false;
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            //已鉴定
            identified(){
                let self= this;
                self.pageNum+=1;
                this.post('/turnedoctormain/gradelist', {
                    command: 'turnedoctormain/gradelist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    type:1,
                    pageSize: 20,
                    pageNum: self.pageNum
                }).done(data => {
                    if(data && data.errcode ==0){
                        self.isgetmore = true ;
                        if(data.beanList){
                            self.iscontent = false;
                            self.hasdata = data.beanList;
                            self.hasdata.count = self.count;
                        }else {
                            self.iscontent = true
                        }
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },

            // 返回按钮
            back() {
                // window.location.href='/pages/futuredoctorapp/todo.html?view=application';
                window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
                if(this.$route.query.stem) {
    //     this.$router.push({
    //     name: "wxMenu",
    //     });
    //   }else {
    //     this.$router.push({
    //     name: "wxIndex",
    //     });
      }
            },
            setShow(val){
               this.gettime.show=true;
            },
            changeTab(tab) {
                this.type = tab.data;
            },
            //获取年级信息
            initgrade(){
                let self=this;
                this.post('/traineestudent/queryDictionaryList',{
                    command: 'traineestudent/queryDictionaryList',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    code:'turngrade'
                }).done((data)=>{
                    if(data && data.errcode ==0){
                        self.seltype.mainlist = data.dic_list;
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
        },
        created(){
            if(this.$route.query.dotype == 2){
                this.type = 2
            }
        },
        mounted(){
            let self=this;
            this.initgrade();
            this.registerToNative('goBack', function (data) {
                self.back();
            });
        }

    }

</script>
<style lang="scss" scoped>
.g-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .PVelQ {
        height: 60px;
        background: #FFF;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #c9caca;
        justify-content: space-between;
        .IlcPRs {
            margin-left: 20px;
        }
        .PbwTy {
            margin-right: 20px;
        }
    }
}
    .toDentifyListWrap{
        height: 100%;
        .toDentifyList {
            height: 100%;
        }
    }
</style>


