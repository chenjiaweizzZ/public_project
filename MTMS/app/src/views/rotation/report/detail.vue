<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{listname}}
        </c-header>

        <div class="g-main">
            <ul v-if="listname == '带教未评人数' ">
                <li>
                    <span>带教老师</span>
                    <span>工号</span>
                    <span>未评学员数量</span>
                    <span>评价完成率</span>
                </li>
                <li class="sizecolor" v-for="item in detaillist">
                    <span>{{item.name}}</span>
                    <span>{{item.username}}</span>
                    <span @click="studentcount(item)">{{item.unfinishedcount}}</span>
                    <span>{{item.finishedrate}}</span>
                </li>
            </ul>

            <ul v-else-if="listname == '学员未评人数' ">
                <li>
                    <span>护培生</span>
                    <span>手机号</span>
                    <span>科室</span>
                    <span>带教老师</span>
                </li>
                <li v-for="item in detaillist">
                    <span>{{item.name}}</span>
                    <span>{{item.mobile}}</span>
                    <span>{{item.evaluatedept}}</span>
                    <span>{{item.evaluateteacher}}</span>
                </li>
            </ul>

            <ul v-else><!--计划轮转人数；实际轮转人数；当月入科人数；当月出科人数-->
                <li>
                    <span>护培生</span>
                    <span>护培学号</span>
                    <span>手机号</span>
                    <span>专业基地</span>
                </li>
                <li v-for="item in detaillist">
                    <span>{{item.name}}</span>
                    <span>{{item.username}}</span>
                    <span>{{item.mobile}}</span>
                    <span>{{item.basename}}</span>
                </li>
            </ul>
        </div>
        <!--查看未评学员数量 -->
        <c-modal :config="showdetail">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <ul class="doctorupdata">
                        <li>
                            <span>护培生</span>
                            <span>手机号</span>
                        </li>
                        <li v-for="(val,index) in popuplist" >
                            <span>{{val.name}}</span>
                            <span>{{val.mobile}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </c-modal>
    </div>
</template>
<script>
    import Vue from 'vue'
    import cHeader from '../../header'
    import methods from '../../../methods'
    import cModal from '../../../components/modal'
    export default {
        name: 'rotation_admin',
        components: {
            cHeader,
            methods,
            cModal,
        },
        data() {
            return {
                listname:'',
                detaillist:[],
                popuplist:[],
                showdetail: {
                    show: false,
                    title: '未评价学员',
                    hideOnClickOut: true,
                },
            }
        },
        created() {
        },
        mounted() {
            let self = this;
            self.titledeptid = self.$route.query.deptid,
            self.registerToNative('goBack', function (data) {
                self.back();
            });
            self.init();
        },
        methods: {
            ...methods,
            back:function () {
              //  window.history.go(-1)
                if(this.$route.query.iswhere == 1){
                    this.$router.push({
                        name: 'fdRotation_reportlist',
                        query: {
                            deptid:this.$route.query.deptid,
                            deptname:this.$route.query.deptname,
                            activeKey: this.$route.query.activeKey
                        }
                    })
                }else if(this.$route.query.iswhere == 2){
                    this.$router.push({
                        name: 'fdRotation_reporthistory',
                        query: {
                            deptid:this.$route.query.deptid,
                            deptname:this.$route.query.deptname,
                            activeKey: this.$route.query.activeKey
                        }
                    })
                }
            },
            init(){
                let self = this;
                console.log(111)
                self.post('/turnedoctormain/getreportshowdetaillist', {
                    command: 'turnedoctormain/getreportshowdetaillist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid:$.cookie('uid'),
                    deptid:self.titledeptid,
                    // deptIdList: !Array.isArray(self.titledeptid) ? [self.titledeptid] : self.titledeptid,
                    yearmonth:self.$route.query.yearmonth,
                    type:self.$route.query.listtype,//当前或未来轮转信息：1		//查看历史报告：2
                }).done(function (data) {
                    if(data && data.errcode == 0){
                        self.detaillist = data.beanlist;
                        self.listname = data.title;
                    }
                }).fail(function (error) {

                })
            },
            studentcount(item){
                let self = this;
                self.post('/dailyevaluation/queryevaluateturndoctor', {
                    command: 'dailyevaluation/queryevaluateturndoctor',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid:$.cookie('uid'),
                    teacherid:item.id,
                    type:4,
                    starttime:self.$route.query.yearmonth,
                    endtime:self.$route.query.yearmonth,
                    evaluationstatus:0,
                }).done(function (data) {
                    if(data && data.errcode == 0){
                        self.popuplist = data.turndoctorlist;
                        self.showdetail.show = true;
                    }
                }).fail(function (error) {

                })
            },
        }
    }

</script>
<style scoped lang="scss">
    .looktable{
        font-size:0.3rem;
        margin-top: 0.1rem;
    }
    .deptname {
        width: 50%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        font-size: 0.25rem!important;
        img {
            width: .28rem;
        }
    }
    .g-main{
        background: #fff!important;
        ul {
            li {
                white-space: nowrap;
                height:0.76rem;
                line-height:1rem;
                font-size: 0.23rem;
                text-align: center;
                border-bottom: 1px solid #999;
                span{
                    min-width: 1.3rem;
                    text-align: center;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                span:nth-child(1){
                    width: 1.2rem;
                }
                span:last-child{
                    width: 1.2rem;
                    text-align: center;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
    .doctorupdata{
        li{
            span{
                width:40%;
                text-align: center;
                padding:0.1rem;
            }
        }
    }
    .sizecolor{
        span:nth-child(3){
            color: #3499db;
        }
    }
</style>
