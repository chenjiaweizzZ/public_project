<template>
    <div class="g-wrapper" >
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png"/>
                </a>
            </div>
            {{title}}
        </c-header>
        <div class="inspection_ug_detail">
            <ul class="title" v-if="type==6">
                <li>护培生</li>
                <li>手机号</li>
                <li>科室</li>
                <li>带教老师</li>
            </ul>
            <ul class="title" v-else-if="type==5">
                <li>带教老师</li>
                <li>工号</li>
                <li>未评学员数量</li>
                <li>评价完成率</li>
            </ul>
            <ul class="title" v-else>
                <li>护培生</li>
                <li>护培学号</li>
                <li>手机号</li>
                <li>专业基地</li>
            </ul>
        </div>
        <div class="g-main" v-if="type==6">
            <div class="inspection_ug_detail_wrap">
                <ul class="content" v-for="(item,index) in resultList">
                    <li>{{item.name}}</li>
                    <li>{{item.mobile}}</li>
                    <li>{{item.evaluatedept}}</li>
                    <li>{{item.evaluateteacher}}</li>
                </ul>
            </div>
        </div>
        <div class="g-main" v-else-if="type==5" >
            <div class="inspection_ug_detail_wrap">
                <ul class="content" v-for="(item,index) in resultList">
                    <li>{{item.name}}</li>
                    <li>{{item.username}}</li>
                    <li  @click="getDetail(item.id)" class="activeColor" :class="{'noclick':!item.unfinishedcount}" >{{item.unfinishedcount}}</li>
                    <li>{{item.finishedrate}}</li>
                </ul>
            </div>
        </div>
        <div class="g-main" v-else>
            <div class="inspection_ug_detail_wrap">
                <ul class="content" v-for="(item,index) in resultList">
                    <li>{{item.name}}</li>
                    <li>{{item.username}}</li>
                    <li>{{item.mobile}}</li>
                    <li>{{item.basename}}</li>
                </ul>
            </div>
        </div>
       <!--<no-content v-if="resultList.length==0"></no-content>-->
        <div class="dialog" v-if="dialogVisible" >
            <span class="img" @click="close"><img src="../../assets/images/closeL.png" alt=""></span>
            <p class="title">未评人员</p>
            <ul>
                <li>护培生</li>
                <li>手机号</li>
            </ul>
            <div class="ulWrap">
                <ul class="ulContent" v-for="(item,index) in noevalutelist">
                    <li>{{item.name}}</li>
                    <li>{{item.mobile}}</li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
    import methods from '@/methods';
    import cHeader from '@/views/header';
    import {mapState, mapActions} from 'vuex';
    import noContent from '@/views/no_content.vue';

    export default {
        name: 'inspection_ug_detail',
        props:{
          detailVisible:{
            defalut:false
          },
          deptid:{
              default:''
          },
          type:{
              default:''
          },
          yearmonth:{
              type:String,
              default:'2018-10'
          },
          url:{
              type:String,
              default:''
          }
        },
        data(){
            return{
                resultList:[],
                title:'',
                noevalutelist:[],
                dialogVisible:false
            }
        },
        components: {
            cHeader,
            noContent
        },
        methods:{
            ...methods,
            ...mapActions([
                'toast'
            ]),
            back () {
               this.$emit("getVisible",false)
            },
            close(){
                this.dialogVisible=false;
            },
            getDetail(id){
                this.noevalutelist=[];
                let self=this;
                this.post('/dailyevaluation/queryevaluateturndoctor', {
                    command: 'dailyevaluation/queryevaluateturndoctor',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    teacherid:id,
                    type:4,
                    starttime:self.yearmonth,
                    endtime:self.yearmonth,
                    deptid: self.deptid,
                    evaluationstatus:0
                }).done(res => {
                    if (res && res.errcode) {
                        self.dialogVisible=true;
                        if (res.errcode == 0) {
                            self.noevalutelist=res.turndoctorlist
                        }
                    }else {
                        self.toast(res.errdesc)
                    }
                });
            },
            getData(){
                let self=this;
                this.post('/turnedoctormain/getreportshowdetaillist', {
                    command:'turnedoctormain/getreportshowdetaillist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    yearmonth:self.yearmonth ,
                    type:self.type,
                    deptid:self.deptid
                }).done(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            self.resultList=res.beanlist;
                            self.title=res.title;
                        }
                    }
                })
            }
        },
        mounted(){
            let self = this
            this.registerToNative('goBack', function (data) {
                self.back()
            })
            this.getData()
        }
    }
</script>

<style scoped lang="scss">
     @import '../../scss/mixin.scss';
    .inspection_ug_detail{
        background:#fff ;
        >.title{
            @include sexy-flex;
            li{
                @include flex1(1);
                height: 0.6rem;
                text-align: center;
                line-height: 0.6rem;
            }
            border-bottom: 1px solid $borderColor;
        }
    }

     .activeColor {
         color: $activeColor !important;
     }
     .inspection_ug_detail_wrap {
         font-size:0.22rem;
         background:#fff ;
         .content {
             @include sexy-flex;
             flex-flow: row nowrap;
             padding: 0;
             li{
                 @include flex1(1);
                 height: 0.6rem;
                 text-align: center;
                 line-height: 0.6rem;
                 border-bottom: 1px solid $borderColor;
                 text-overflow: ellipsis;
                 overflow: hidden;
                 white-space: nowrap;
             }
         }
     }

     .g-wrapper {
         position: fixed;
         top: 0;
         left: 0;
         width: 100%;
         z-index: 1000;
     }
    .dialog{
        background: #fff;
        position: fixed;
        top:20%;
        left:0;
        width:90%;
        left: 5%;
        border:1px solid $borderColor;
        @include sexy-flex;
        flex-flow: column wrap;
        .img{
            position: absolute;
            right:0rem;
            top:0rem;
            img{
                width:0.4rem;
                height: auto;
            }
        }
        >.title{
            height:0.7rem;
            line-height: 0.7rem;
            background: $bgColor;
            text-align: center;
            font-size:14px;
        }
        ul{
            width: 100%;
            @include sexy-flex;
            flex-flow: row nowrap;
            li{
                height: 0.65rem;
                text-align: center;
                line-height: 0.65rem;
                @include flex1(1);
                border-bottom:1px solid $borderColor;

            }
        }
        .ulWrap {
            max-height:4rem;
            overflow-y: auto;
            .ulContent:nth-last-child(1) {
                li {
                    border-bottom: 0;
                }

            }
        }


    }
</style>
